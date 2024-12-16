import React, { useEffect, useState, useImperativeHandle } from "react";
import "./Index.scss";

import { clsWrite, clsCombine } from "../../../utils/cls";

interface Props {
  treesRef?: any;
  wrapperClassName?: any;
  id: string;
  name: string;
  data: any[];
  defaultId?: any;
  treeDataItemClick?: Function; // 树节点的点击回调
  createCustomContent?: (node: any) => JSX.Element; // 新增自定义内容生成函数
  dataService?: any; // 可选：数据服务
  dataServiceFunction?: string; // 可选：服务函数名称
  dataServiceFunctionParams?: any[]; // 可选：服务函数参数
}

const getMenuNodes = (
  id: string,
  name: string,
  menuList: any[],
  toggleNode: (node: any) => void,
  chooseId: any,
  handleItemClick: (id: any) => void
) => {
  return (
    <ul className="tree__diagram">
      {menuList.map((item: any, index: any) => {
        const isChosen = chooseId == item[id]; // 判断是否被点击
        const hasChildren = !!item.children && item.children.length > 0; // 判断是否有子节点

        return (
          <li
            className="tree__diagram__item"
            key={item[id] || index}
            data-id={item[id]}
            data-item={JSON.stringify(item)}
          >
            <div className="tree__item">
              {hasChildren || !item.active ? (
                <span
                  className="arrow"
                  onClick={() => {
                    toggleNode(item);
                  }}
                >
                  {item.loading ? (
                    <span className="loading-icon">
                      <svg width="1em" height="1em" viewBox="0 0 512 512">
                        <g>
                          <path
                            fill="currentColor"
                            d="M256,0c-23.357,0-42.297,18.932-42.297,42.288c0,23.358,18.94,42.288,42.297,42.288c23.357,0,42.279-18.93,42.279-42.288C298.279,18.932,279.357,0,256,0z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M256,427.424c-23.357,0-42.297,18.931-42.297,42.288C213.703,493.07,232.643,512,256,512c23.357,0,42.279-18.93,42.279-42.288C298.279,446.355,279.357,427.424,256,427.424z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M74.974,74.983c-16.52,16.511-16.52,43.286,0,59.806c16.52,16.52,43.287,16.52,59.806,0c16.52-16.511,16.52-43.286,0-59.806C118.261,58.463,91.494,58.463,74.974,74.983z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M377.203,377.211c-16.503,16.52-16.503,43.296,0,59.815c16.519,16.52,43.304,16.52,59.806,0c16.52-16.51,16.52-43.295,0-59.815C420.489,360.692,393.722,360.7,377.203,377.211z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M84.567,256c0.018-23.348-18.922-42.279-42.279-42.279c-23.357-0.009-42.297,18.932-42.279,42.288c-0.018,23.348,18.904,42.279,42.279,42.279C65.645,298.288,84.567,279.358,84.567,256z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M469.712,213.712c-23.357,0-42.279,18.941-42.297,42.288c0,23.358,18.94,42.288,42.297,42.297c23.357,0,42.297-18.94,42.279-42.297C512.009,232.652,493.069,213.712,469.712,213.712z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M74.991,377.22c-16.519,16.511-16.519,43.296,0,59.806c16.503,16.52,43.27,16.52,59.789,0c16.52-16.519,16.52-43.295,0-59.815C118.278,360.692,91.511,360.692,74.991,377.22z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M437.026,134.798c16.52-16.52,16.52-43.304,0-59.824c-16.519-16.511-43.304-16.52-59.823,0c-16.52,16.52-16.503,43.295,0,59.815C393.722,151.309,420.507,151.309,437.026,134.798z"
                          ></path>
                        </g>
                      </svg>
                    </span>
                  ) : (
                    <var
                      className={`default-icon ${item.active ? "rotated" : ""}`}
                    >
                      <svg
                        width="0.75em"
                        height="0.75em"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M15.795 11.272L7.795 16.272C6.79593 16.8964 5.5 16.1782 5.5 15L5.5 5.00002C5.5 3.82186 6.79593 3.1036 7.795 3.72802L15.795 8.72802C16.735 9.31552 16.735 10.6845 15.795 11.272Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </var>
                  )}
                </span>
              ) : null}

              <div className={`link-text`}>
                <span
                  className={`hoverable ${isChosen ? "is-active" : ""}`}
                  onClick={() => {
                    handleItemClick(item);
                  }}
                >
                  {item.icon && <var>{item.icon}</var>}
                  {item[name]}
                </span>

                {item.customContent && (
                  <div className="custom-content">{item.customContent}</div>
                )}
              </div>
            </div>

            {item.active && hasChildren && (
              <div className="tree__children">
                {getMenuNodes(
                  id,
                  name,
                  item.children,
                  toggleNode,
                  chooseId,
                  handleItemClick
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default function Index({
  treesRef,
  id,
  name,
  wrapperClassName,
  data,
  defaultId,
  treeDataItemClick,
  createCustomContent,
  dataService,
  dataServiceFunction,
  dataServiceFunctionParams,
}: Props) {
  const [treeData, setTreeData] = useState<any>(data);

  const [chooseId, setChooseId] = useState<any>(null);

  const handleItemClick = (item: any) => {
    setChooseId(item[id]);

    if (treeDataItemClick) {
      treeDataItemClick(item);
    }
  };

  // 递归更新某个节点的 active 和 children
  const updateTreeNode = (
    nodes: any[],
    nodeId: any,
    callback: (node: any) => void
  ) => {
    return nodes.map((node) => {
      if (node[id] === nodeId) {
        callback(node); // 修改当前节点
      } else if (node.children && node.children.length > 0) {
        node.children = updateTreeNode(node.children, nodeId, callback); // 递归修改子节点
      }
      return node;
    });
  };

  // 节点点击逻辑
  const toggleNode = (node: any) => {
    if (!node.children || node.children.length === 0) {
      // 如果没有子节点，动态加载
      setTreeData((prevData: any) =>
        updateTreeNode(prevData, node[id], (n) => {
          n.loading = true;
        })
      );

      if (dataService && dataServiceFunction) {
        const params = [...(dataServiceFunctionParams || [])];

        // 检查是否有 $QUERY_STRING，如果有，替换 keyword
        const queryIndex = params.indexOf("$QUERY_STRING");
        if (queryIndex !== -1) {
          params[queryIndex] = node;
        }

        dataService[dataServiceFunction](...params).then((result: any) => {
          if (result.length > 0) {
            const newChildren = result.map((item: any) => ({
              ...item,
              active: false,
              loading: false,
              children: [],
              customContent: createCustomContent && createCustomContent(item),
            }));

            setTreeData((prevData: any) =>
              updateTreeNode(prevData, node[id], (n) => {
                n.children = [...newChildren]; // 填充子节点
                n.active = true; // 展开当前节点
                n.loading = false;
              })
            );
          } else {
            setTreeData((prevData: any) =>
              updateTreeNode(prevData, node[id], (n) => {
                n.children = [];
                n.active = true;
                n.loading = false;
              })
            );
          }
        });
      } else {
        setTimeout(() => {
          setTreeData((prevData: any) =>
            updateTreeNode(prevData, node[id], (n) => {
              n.active = true;
              n.loading = false;
            })
          );
        }, 100);
      }
    } else {
      // 如果已有子节点，直接切换 active 状态
      setTreeData((prevData: any) =>
        updateTreeNode(prevData, node[id], (n) => {
          n.active = !n.active;
        })
      );
    }
  };

  // 外部调用，更新数据
  const updatedTreeNode = (
    node: any,
    updatedId: any,
    dataServiceUpdatedFunction: any
  ) => {
    if (dataService && dataServiceUpdatedFunction) {
      const params = [...(dataServiceFunctionParams || [])];

      // 检查是否有 $QUERY_STRING，如果有，替换 keyword
      const queryIndex = params.indexOf("$QUERY_STRING");
      if (queryIndex !== -1) {
        params[queryIndex] = node;
      }

      dataService[dataServiceUpdatedFunction](...params).then((result: any) => {
        if (result.length > 0) {
          const newChildren = result.map((item: any) => ({
            ...item,
            active: false,
            loading: false,
            children: [],
            customContent: createCustomContent && createCustomContent(item),
          }));

          setTreeData((prevData: any) =>
            updateTreeNode(prevData, node[updatedId], (n) => {
              n.children = [...newChildren]; // 填充子节点
              n.active = true; // 展开当前节点
              n.loading = false;
            })
          );
        } else {
          setTreeData((prevData: any) =>
            updateTreeNode(prevData, node[updatedId], (n) => {
              n.children = [];
              n.active = true;
              n.loading = false;
            })
          );
        }
      });
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      setTreeData(data);
    } else {
      setTreeData([]);
    }
  }, [data]);

  useEffect(() => {
    if (defaultId) {
      setChooseId(defaultId);
    } else {
      setChooseId(null);
    }
  }, [defaultId]);

  useImperativeHandle(treesRef, () => ({
    updatedTreeNode,
  }));

  return (
    <>
      {treeData.length > 0 && (
        <nav className={clsCombine("trees__wrapper", wrapperClassName)}>
          {getMenuNodes(
            id,
            name,
            treeData,
            toggleNode,
            chooseId,
            handleItemClick
          )}
        </nav>
      )}
    </>
  );
}
