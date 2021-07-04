import React, { useEffect, useState } from "react";
import styled from 'styled-components';


const TabsStyle = styled.div`
.custom-tab .tab-content {
    min-height: 100px;
    border: 1px solid #dcdcdc;
    border-top: none;
 }

.nav-tabs {
    border-bottom: 1px solid #dee2e6;
}

 .nav {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
}
`

const Tabs = ({ children, active = 0 }) => {
  const [activeTab, setActiveTab] = useState(active);
  const [tabsData, setTabsData] = useState([]);

  useEffect(() => {
    let data = [];

    React.Children.forEach(children, (element) => {
      if (!React.isValidElement(element)) return;

      const {
        props: { tab, children },
      } = element;
      data.push({ tab, children });
    });

    setTabsData(data);
  }, [children]);

  return (
    <>
      <TabsStyle>
        <div className="w-100 custom-tab">
        <ul className="nav nav-tabs">
            {tabsData.map(({ tab }, idx) => (
            <li key={idx} className="nav-item">
                <a
                className={`nav-link ${idx === activeTab ? "active" : ""}`}
                href="#"
                onClick={() => setActiveTab(idx)}
                >
                {tab}
                </a>
            </li>
            ))}
        </ul>

        <div className="tab-content p-3">
            {tabsData[activeTab] && tabsData[activeTab].children}
        </div>
        </div>
    </TabsStyle>
    </>
  );
};

const TabPane = ({ children }) => {
  return { children };
};

Tabs.TabPane = TabPane;

export default Tabs;