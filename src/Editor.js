import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { useDispatch } from "react-redux";

const initialCode = `/** 
* Enter your one-time code here. 
* This function will run only once in the function's lifetime
*/

function init(){
  return 'hello';
}`;
export default function Editor(props) {
  const [codeObj, setCode] = useState({ 1: initialCode });
  const [currentTab, setCurrentTab] = useState("1");
  const [tempCode, setTempCode] = useState(codeObj[currentTab] || initialCode);
  const dispatch = useDispatch();

  useEffect(() => {
    let obj = codeObj[currentTab];
    dispatch({ type: "currentTab", res: currentTab });
    dispatch({ type: "currentCode", res: obj });
  }, [currentTab]);

  let handleTab = (e, tab) => {
    if (tab == "add") {
      let last = 1;
      if (Object.keys(codeObj).length > 0) {
        let keys = Object.keys(codeObj).sort(function (c1, c2) {
          c1 = Number(c1);
          c2 = Number(c2);
          if (c1 >= c2) return 1;
          return -1;
        });
        last = keys[keys.length - 1];
        last = Number(last) + 1;
      }
      setCode({
        ...codeObj,
        [last]: initialCode,
      });
      if (Object.keys(codeObj).length == 0) setCurrentTab("1");
    } else {
      setCurrentTab(tab);
      setTempCode(codeObj[tab] || initialCode);
    }
  };

  let onChange = (event) => {
    let customCode = event.target.value;
    setTempCode(customCode);
    try {
      eval(customCode);
      if (eval(customCode + "; if (typeof init === 'function') {1;}") == 1) {
        var applyBttn = document.getElementById("applyButton");
        if (applyBttn) applyBttn.classList.add("active");
      } else {
        var applyBttn = document.getElementById("applyButton");
        if (applyBttn) applyBttn.classList.remove("active");
      }
    } catch (e) {
      var applyBttn = document.getElementById("applyButton");
      if (applyBttn) applyBttn.classList.remove("active");
    }
  };

  let applyChanges = (e) => {
    var applyBttn = document.getElementById("applyButton");
    if (applyBttn && applyBttn.classList.contains("active")) {
      let customCode = tempCode;
      setCode({ ...codeObj, [currentTab]: customCode });
      let obj = customCode;
      dispatch({ type: "currentTab", res: currentTab });
      dispatch({ type: "currentCode", res: obj });
      applyBttn.classList.remove("active");
    }
  };

  let deleteTab = (e) => {
    let cloneObj = { ...codeObj };
    delete cloneObj[currentTab];
    setCode(cloneObj);
    if (Object.keys(cloneObj).length > 0) {
      setCurrentTab(
        Object.keys(cloneObj).sort(function (c1, c2) {
          c1 = Number(c1);
          c2 = Number(c2);
          if (c1 >= c2) return 1;
          return -1;
        })[0]
      );
      setTempCode(cloneObj[currentTab - 1] || initialCode);
    } else {
      setTempCode("");
    }
  };

  let arr = Object.keys(codeObj)
    .sort(function (c1, c2) {
      c1 = Number(c1);
      c2 = Number(c2);
      if (c1 >= c2) return 1;
      return -1;
    })
    .map((tab, i) => (
      <Tab
        label={"Item " + tab}
        value={tab}
        key={tab}
        classes={{
          root: "tabButtons",
        }}
      />
    ));
  arr.push(
    <Tab
      label="+"
      value={"add"}
      key={"New+"}
      classes={{
        root: "newTab",
      }}
    />
  );
  return (
    <React.Fragment>
      <div className="user_container">
        <TabContext value={currentTab}>
          <AppBar
            position="static"
            classes={{
              root: "appbar",
            }}
          >
            <TabList
              onChange={handleTab}
              aria-label="simple tabs example"
              classes={{
                root: "para",
                scroller: "scroller",
              }}
            >
              {arr}
            </TabList>
          </AppBar>
          <span className="applyButton" id="applyButton" onClick={applyChanges}>
            Apply Changes
          </span>
          <span className="deleteIcon" onClick={deleteTab}>
            X
          </span>
          <TabPanel
            value={currentTab}
            classes={{
              root: "tabPanel",
            }}
          >
            <textarea
              className="notetextarea"
              onChange={onChange}
              value={tempCode}
            />
          </TabPanel>
        </TabContext>
      </div>
    </React.Fragment>
  );
}
