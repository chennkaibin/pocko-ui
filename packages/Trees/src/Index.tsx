import React, { useEffect, useState, useImperativeHandle } from "react";
import "./Index.scss";

import { clsWrite, clsCombine } from "../../../utils/cls";

interface Props {
  treesRef?: any;
  wrapperClassName?: any;
  leafIcon?: React.ReactNode; // 空数据图标
  arrowIcons?: React.ReactNode[]; // 展开，关闭图标
  hasChildrenFn?: (node: any) => boolean; // 判断是否有子节点
  id: string;
  name: string;
  data: any[];
  defaultId?: any;
  treeDataItemClick?: Function; // 树节点的点击回调
  renderCustomContent?: (node: any) => JSX.Element; // 新增自定义内容生成函数
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
  handleItemClick: (id: any) => void,
  checkHasChildren: (node: any) => boolean,
  renderCustomContent?: (item: any) => React.ReactNode,
  arrowIcons?: React.ReactNode[],
  leafIcon?: React.ReactNode
) => {
  return (
    <ul className="tree__diagram">
      {menuList.map((item: any, index: any) => {
        const isChosen = chooseId == item[id]; // 判断是否被点击
        const hasChildren = checkHasChildren(item); // 判断是否有子节点(根据外部列表参数判断)

        return (
          <li
            className="tree__diagram__item"
            key={item[id] || index}
            data-id={item[id]}
            data-item={JSON.stringify(item)}
          >
            <div className="tree__item">
              <span
                data-isexpand={hasChildren}
                className="arrow"
                onClick={() => {
                  if (hasChildren) toggleNode(item);
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
                ) : // 无子节点且提供了无子节点时图标
                !hasChildren ? (
                  leafIcon ?? null
                ) : arrowIcons && arrowIcons.length > 0 ? (
                  arrowIcons.length === 1 ? (
                    // 只提供了一个图标时，需要有旋转动画
                    <var
                      className={`default-icon ${item.active ? "rotated" : ""}`}
                    >
                      {arrowIcons[0]}
                    </var>
                  ) : (
                    // 提供了2个图标，即展开、收缩，无旋转动画
                    <span className="no-animation-icon">
                      {item.active ? arrowIcons[1] : arrowIcons[0]}
                    </span>
                  )
                ) : (
                  // 默认svg
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

                {renderCustomContent && (
                  <div className="custom-content">
                    {renderCustomContent(item)}
                  </div>
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
                  handleItemClick,
                  checkHasChildren,
                  renderCustomContent,
                  arrowIcons,
                  leafIcon
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
  arrowIcons,
  leafIcon,
  hasChildrenFn,
  data,
  defaultId,
  treeDataItemClick,
  renderCustomContent,
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
    callback: (node: any) => any
  ): any[] => {
    return nodes.map((node) => {
      if (node[id] === nodeId) {
        return {
          ...node,
          ...callback(node),
        };
      } else if (Array.isArray(node.children) && node.children.length > 0) {
        return {
          ...node,
          children: updateTreeNode(node.children, nodeId, callback),
        };
      } else {
        return node;
      }
    });
  };

  // 判断节点
  const checkHasChildren = (n: any) =>
    hasChildrenFn?.(n) || (Array.isArray(n.children) && n.children.length > 0);

  // 节点点击逻辑
  const toggleNode = (node: any) => {
    const mayHave = checkHasChildren(node); // 业务上“可能有子节点”
    const loaded = Array.isArray(node.children) && node.children.length > 0; // 确实已经往 children 塞了数据

    if (mayHave && !loaded) {
      // 如果没有子节点，动态加载
      setTreeData((prevData: any) =>
        updateTreeNode(prevData, node[id], (n) => ({
          loading: true,
        }))
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
            }));

            setTreeData((prevData: any) =>
              updateTreeNode(prevData, node[id], (n) => ({
                children: [...newChildren],
                active: true,
                loading: false,
              }))
            );
          } else {
            setTreeData((prevData: any) =>
              updateTreeNode(prevData, node[id], (n) => ({
                children: [],
                active: true,
                loading: false,
              }))
            );
          }
        });
      } else {
        setTimeout(() => {
          setTreeData((prevData: any) =>
            updateTreeNode(prevData, node[id], (n) => ({
              active: true,
              loading: false,
            }))
          );
        }, 100);
      }
    } else {
      // 如果已有子节点，直接切换 active 状态
      setTreeData((prevData: any) =>
        updateTreeNode(prevData, node[id], (n) => ({
          active: !n.active,
        }))
      );
    }
  };

  // 外部调用，更新数据
  const updatedTreeNode = (idValue: any, newValue: any) => {
    setTreeData((prevData: any[]) => {
      // 1. 删除节点（约定 newValue === 'DELETE' 表示删除）
      if (newValue === "DELETE") {
        const removeNode = (nodes: any[]): any[] =>
          nodes
            .filter((n) => n[id] !== idValue)
            .map((n) => ({
              // 递归删除子树里匹配的节点
              ...n,
              children: Array.isArray(n.children) ? removeNode(n.children) : [],
            }));

        return removeNode(prevData);
      }

      // 2. 更新节点
      const updateNode = (nodes: any[]): any[] =>
        nodes.map((n) => {
          if (n[id] === idValue) {
            // 找到目标节点，合并所有 newValue 字段
            return {
              ...n,
              ...newValue,
              // 展开并停止 loading
              active: true,
              loading: false,
            };
          }
          if (Array.isArray(n.children) && n.children.length > 0) {
            // 递归更新子节点
            return {
              ...n,
              children: updateNode(n.children),
            };
          }
          return n;
        });

      return updateNode(prevData);
    });
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
    // 获取父节点的方法
    findNodeWithParentById: (targetId: any) => {
      const recursiveFind = (nodes: any[], parent: any = null): any | null => {
        for (const n of nodes) {
          if (n[id] === targetId) {
            return { node: n, parent };
          }
          if (Array.isArray(n.children) && n.children.length > 0) {
            const found = recursiveFind(n.children, n);
            if (found) return found;
          }
        }
        return null;
      };

      return recursiveFind(treeData, null);
    },
    getTreeData: () => {
      return treeData;
    },
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
            handleItemClick,
            checkHasChildren,
            renderCustomContent,
            arrowIcons,
            leafIcon
          )}
        </nav>
      )}
    </>
  );
}
