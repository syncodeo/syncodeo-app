import React from 'react';
import { Input, Button, Icon } from "antd";

export const getColumnSearchProps = (
    dataIndex: string,
    searchInput: React.RefObject<Input>,
    handleSearch: (selectedKeys: string[], confirm: any) => void,
    handleReset: (clearFilter: any) => void
) => ({
    filterDropdown: ({
        setSelectedKeys, selectedKeys, confirm, clearFilters,
    }: any) => (
            <div style={{ padding: 8, }} className="ant-table-filter-dropdown">
                <Input
                    autoFocus
                    ref={(node: any) => { searchInput = node; }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm)}
                    icon="search"
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
    filterIcon: (filtered: any) => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value: any, record: any) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: boolean) => {
        if (visible) {
            setTimeout(() => searchInput && searchInput.current && searchInput.current.select());
        }
    },
})