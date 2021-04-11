import React, { useState } from 'react';
//Vendor
import Header from '../../header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import {
    Table, Input, Button, Dropdown,
    Menu
} from "antd";
// Custom
import menuIcon from '../../../images/ellipsis-vertical-circle.svg';

import {
    openAddItemDialog, openUpdateStockDialog
} from '../../../redux/actions/alertDialogActions';
import NoItem from '../../loaders/welcome/NoItem';
import AddItemDialog from '../../dialog/AddItemDialog'
import UpdateStockDialog from '../../dialog/UpdateStockDialog'
import SearchIcon from '@material-ui/icons/Search';
import Highlighter from "react-highlight-words";
import {
    deleteItem
} from '../../../redux/actions/itemActions';
import {
    confirmDeleteAction
} from '../../../redux/actions/alertDialogActions';


// Component
function AntdItems() {
    const dispatch = useDispatch();
    const settings = useSelector(
        (state) => state.firebase.profile && state.firebase.profile.settings
    );
    const items = useSelector((state) => state.firestore.ordered.items);
    const warehouse = [...useSelector((state) => state.firestore.ordered.warehouse ?
        state.firestore.ordered.warehouse : [])];
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = React.useState(1);

    if (isLoaded(items) && isLoaded(settings) && isEmpty(items))
        return (
            <>
                <Header title={'Items'} />
                <NoItem companyName={settings.companyName} />
            </>
        );
    if (isLoaded(settings)) {
        warehouse.push({
            name: settings.companyName,
            address: settings.companyAddress,
            mobile: settings.mobile
        })
    }

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => node}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: "block" }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm)}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
        </Button>
                <Button
                    onClick={() => handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Reset
        </Button>
            </div>
        ),
        filterIcon: filtered => (
            // <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
            <SearchIcon style={{ color: filtered ? "#1890ff" : "black", marginTop: "15px" }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex] &&
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                // setTimeout(() => searchInput.select());
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text}
            />
        )
    });

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText("");
    };

    const handleDeleteItem = (item) => {
        dispatch(confirmDeleteAction(deleteItem(item.id)));

    };

    const handleEditItem = (item) => {
        dispatch(openAddItemDialog({ open: true, item }));
    }

    const handleUpdateStock = (item) => {
        dispatch(openUpdateStockDialog({ openUpdateStock: true, item }));
    }


    const columns = [
        {
            title: "Sr.",
            // dataIndex: "status",
            key: "index",
            align: "center",
            render: (value, item, index) => (page - 1) * 10 + index + 1
        },
        {
            title: "Name",
            dataIndex: "itemName",
            align: "left",
            ...getColumnSearchProps("itemName"),
            render: (value, item) => <p className="name">{item.itemName}<br />{item.displayName ? item.displayName : ''}</p>
        },
        {
            title: "Rate",
            dataIndex: "sellingPrice",
            align: "left",
            sorter: (a, b) => a.sellingPrice - b.sellingPrice,
            render: sellingPrice => `₹ ${sellingPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`
        },
        {
            title: "Stock",
            dataIndex: "stock",
            align: "left",
            // ...getColumnSearchProps("property"),
            render: stock => {
                let stockToShow = "";
                for (let [key, value] of Object.entries(stock)) {
                    stockToShow += `${key} : ${value} `
                }
                return stockToShow
            }
        },
        {
            title: "Action",
            align: "left",
            render: item => (
                <>
                    <Dropdown
                        overlay={
                            <>
                                <Menu>
                                    <Menu.Item
                                        onClick={(e) => handleEditItem(e, item)}>Edit Item</Menu.Item>
                                    <Menu.Item
                                        onClick={(e) => handleUpdateStock(e, item)}>Update Stock</Menu.Item>
                                    <Menu.Item onClick={(e) => handleDeleteItem(e, item)}>Delete Item</Menu.Item>
                                </Menu>
                            </>
                        }
                        trigger={["click"]}
                    ><img src={menuIcon} style={{
                        width: '30px',
                        height: '30px'
                    }} alt="menu" /></Dropdown>
                </>
            )
        }
    ];
    return (
        <>
            <div>
                <Header title={'Items'} />
                <div style={{ padding: '1rem' }}>
                    <Button type="primary" onClick={() => dispatch(openAddItemDialog({ open: true }))}>Add Item</Button>

                    <Table
                        locale={{ emptyText: "No Data!" }}
                        columns={columns}
                        dataSource={items}
                        rowkey="id"
                        pagination={{
                            onChange(current) {
                                setPage(current);
                            }
                        }}
                    />
                </div>
                {settings && <AddItemDialog companyName={settings.companyName} />}
                {warehouse && <UpdateStockDialog warehouse={warehouse} />}
            </div>
        </>
    )
}

export default AntdItems;
