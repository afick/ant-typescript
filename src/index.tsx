import React, { ReactText, useState } from "react";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import {
  ColumnTitle,
  CompareFn,
  SortOrder,
  ColumnFilterItem,
  FilterDropdownProps
} from "antd/lib/table/interface";
import { Breakpoint } from "antd/lib/_util/responsiveObserve";
import { Key } from "readline";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
export interface RecordType {}

export interface IColumn extends RecordType {
  title?: ColumnTitle<RecordType>;
  sorter?:
    | boolean
    | CompareFn<RecordType>
    | {
        compare?: CompareFn<RecordType>;
        /** Config multiple sorter order priority */
        multiple?: number;
      };
  sortOrder?: SortOrder;
  defaultSortOrder?: SortOrder;
  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean;
  filtered?: boolean;
  filters?: ColumnFilterItem[];
  filterDropdown?:
    | React.ReactNode
    | ((props: FilterDropdownProps) => React.ReactNode);
  filterMultiple?: boolean;
  filteredValue?: Key[] | null;
  defaultFilteredValue?: Key[] | null;
  filterIcon?: React.ReactNode | ((filtered: boolean) => React.ReactNode);
  onFilter?: (value: string | number | boolean, record: RecordType) => boolean;
  filterDropdownVisible?: boolean;
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
  responsive?: Breakpoint[];
  key: string;
  description: string;
}

export const data = [
  {
    key: "1",
    tools: ["Jest"],
    issue: "TypeError: Cannot read property 'create' of undefined",
    description:
      "When attempting to run Jest snapshot test, it did not like the import of react-test-renderer",
    resolution:
      "Change from:\nimport { renderer } from 'react-test-renderer'\nChange to:\nimport * as renderer from 'react-test-renderer'"
  },
  {
    key: "2",
    tools: ["GraphQL"],
    issue: "No data returned",
    description:
      "API Key expired as, by default, dev API keys expire 7 days after creation",
    resolution:
      "Fix until implement better solution:\nModify amplify/backend/api/viantApi/parameters.json\nSet 'CreateAPIKey: 0'\nDo an 'amplify push' from VSCode terminal\nSet 'CreateAPIKey: 1'\nDo another 'amplify push'"
  }
];

export const Troubleshooting = (props: any) => {
  const [state, setState] = useState({
      searchText: "",
      searchedColumn: "",
      drawerVisible: false,
      selectedRowTitle: "",
      node: new Input(props)
    }),
    handleSearch = (
      selectedKeys: ReactText[],
      confirm: () => void,
      dataIndex: string
    ) => {
      confirm();
      state.searchText = selectedKeys[0].toString();
      state.searchedColumn = dataIndex;
      setState(state);
    },
    handleReset = (clearFilters: () => void) => {
      clearFilters();
      state.searchText = "";
      setState(state);
    },
    getColumnSearchProps = (dataIndex: string) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters
      }: FilterDropdownProps): React.ReactNode => (
        <div style={{ padding: "8px" }}>
          <Input
            ref={(node) => {
              if (node !== null) {
                state.node = node;
                setState(state);
              }
            }}
            placeholder={"Search" + dataIndex}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: "188px", marginBottom: "8px", display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: "90px" }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters as any)}
              size="small"
              style={{ width: "90px" }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean): React.ReactNode => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value: string | number | boolean, record: any): boolean =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toString().toLowerCase())
          : "",
      onFilterDropdownVisibleChange: (visible: boolean): void => {
        if (visible) {
          setTimeout(() => state.node.select(), 100);
        }
      },
      render: (text: { function: any }) => <>{text}</>
    }),
    columns: ColumnsType<IColumn> = [
      {
        title: "Tool",
        dataIndex: "tools",
        filters: [
          {
            text: "GraphQL",
            value: "GraphQL"
          },
          {
            text: "Jest",
            value: "Jest"
          }
        ],

        onFilter: (value: string | number | boolean, record: any): boolean =>
          record.tools.toString().indexOf(value) === 0,

        render: (tool: string, record: any, _index: number) => (
          <>
            <div>{tool}</div>
          </>
        )
      },
      {
        ...getColumnSearchProps("issue"),
        title: "Issue",
        dataIndex: "issue",
        key: "issue"
      },
      {
        ...getColumnSearchProps("description"),
        title: "Description",
        dataIndex: "description",
        key: "description"
      },
      {
        ...getColumnSearchProps("description"),
        title: "Resolution",
        dataIndex: "resolution",
        key: "resolution"
      }
    ];

  return (
    <>
      <div>
        <h4 style={{ color: "#ffffff" }}>Troubleshooting</h4>
      </div>
      <div>
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          id="troubleshooting-table"
        />
      </div>
    </>
  );
};

ReactDOM.render(<Troubleshooting />, document.getElementById("container"));
