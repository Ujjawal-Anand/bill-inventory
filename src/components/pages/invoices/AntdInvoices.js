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
import SearchIcon from '@material-ui/icons/Search';
import Highlighter from "react-highlight-words";
import {
    deleteItem
} from '../../../redux/actions/itemActions';
import {
    confirmDeleteAction
} from '../../../redux/actions/alertDialogActions';


// Component
function AntdInvoices() {
    const dispatch = useDispatch();

    const invoices = useSelector((state) => state.firestore.ordered.invoices);
    const [searchText, setSearchText] = useState('');

    if (isLoaded(invoices) && isEmpty(invoices)) {
        return (
            <>
                <Header title={'invoices'} />
            </>
        );
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

    // let filteredInfo = filteredInfo || {};

    const columns = [
        {
            title: "No.",
            dataIndex: "invoiceNumber",
            key: "index",
            ...getColumnSearchProps("invoiceNumber"),
            sorter: (a, b) => a.invoiceNumber - b.invoiceNumber,
            align: "center"
        },
        {
            title: "Date",
            dataIndex: "invoiceDate",
            align: "left",
            ...getColumnSearchProps("invoiceDate"),
            // render: (value, item) => <p className="name">{item.itemName}<br />{item.displayName ? item.displayName : ''}</p>
        },
        {
            title: "Customer Name",
            dataIndex: "customerName",
            align: "left",
            sorter: (a, b) => a.sellingPrice - b.sellingPrice,
            ...getColumnSearchProps("customerName")
        },
        {
            title: "Amount",
            dataIndex: "totalAmount",
            align: "left",
            sorter: (a, b) => a.totalAmount - b.totalAmount,
            // ...getColumnSearchProps("property"),
            render: totalAmount => `₹ ${totalAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`
        },
        {
            title: "Status",
            dataIndex: "paidStatus",
            align: "left",
            sorter: (a, b) => a.paidStatus.length - b.paidStatus.length,
            filters: [
                { text: 'Full Paid', value: 'full-paid' },
                { text: 'Partial Paid', value: 'partial-paid' },
                { text: 'Full Pending', value: 'unpaid' },
            ],
            // filteredValue: filteredInfo.paidStatus || null,
            onFilter: (value, record) => record.paidStatus.includes(value),
            render: (paidStatus, invoice) =>
                paidStatus === 'full-paid' ? (
                    <span style={{ color: '#219735' }}>Paid</span>
                ) : paidStatus === 'partial-paid' ? (<>
                    <span style={{ color: '#6772E5' }}>Partialy</span> <br />
                    <span>Paid: ₹{invoice.amountPaid} </span>
                </>
                ) : (
                    <span style={{ color: '#FD5665' }}>Pending</span>
                )
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
                <Header title={'invoices'} />
                <div style={{ padding: '1rem' }}>
                    <Table
                        locale={{ emptyText: "No Data!" }}
                        columns={columns}
                        dataSource={invoices}
                        rowkey="id"
                    />
                </div>
            </div>
        </>
    )
}

export default AntdInvoices;
