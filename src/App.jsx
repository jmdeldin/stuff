import React, { Component } from 'react';
import './vendor/normalize.css';
import './vendor/skeleton.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draft: this.freshDraft(),
      items: new Map(
        [
          ["boots", new Map([["qty", 1]])],
        ]
      ),
    };

      //   new Map([["id", "ID-1"], ["name", "boots"], ["qty", 1]]),
      //   new Map([["id", "ID-2"], ["name", "socks"], ["qty", 2]]),
      // ],
    // };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  handleInputChange(event) {
    let target = event.target,
        value = target.value,
        name = target.name,
        draft = this.state.draft;

    if (name === "name" || name === "qty") {
      draft.set(name, value);
    }

    this.setState({draft: draft});
  }

  isValid() {
    let draft = this.state.draft;

    return draft.get("name") !== "" && draft.get("qty") > 0;
  }

  cloneMap(map) {
    let newMap = new Map();
    map.forEach(function (subMap, key) {
      let tmp = new Map();
      for (let [subKey, subValue] of subMap.entries()) {
        tmp.set(subKey, subValue);
      }
      newMap.set(key, tmp);
    });

    return newMap;
  }

  addItem() {
    let items = this.cloneMap(this.state.items),
        existing = items.get(this.state.draft.get("name"));

    if (existing) {
      existing.set("qty", parseInt(existing.get("qty"), 10) + 1);
    } else {
      items.set(this.state.draft.get("name"), this.state.draft);
    }

    this.setState({items: items}, this.resetDraft);
  }

  uuid() {
    return crypto.getRandomValues(new Uint32Array(4)).join('-');
  }

  freshDraft() {
    return new Map([["id", this.uuid()], ["name", ""], ["qty", "1"]]);
  }

  resetDraft() {
    this.setState({draft: this.freshDraft()});
  }

  handleSubmit(event) {
    if (this.isValid()) {
      this.addItem();
    }

    this.nameInput.focus();
    event.preventDefault();
  }

  removeItem(name) {
    debugger
    let items = this.cloneMap(this.state.items);
    if (items.get(name)) {
      items.delete(name);
    }
    this.setState({items: items});
  }

  render() {
    let renderedItems = [];
    this.state.items.forEach((item, name) => {
      renderedItems.push(
        <tr key={name}>
          <td>{name}</td>
          <td>{item.get("qty")}</td>
          <td>
            <button onClick={this.removeItem.bind(this, name)}>Remove</button>
          </td>
        </tr>
      );
    });

    return (
      <div className="container">
        <div className="logo">
          <h1>Stuff!</h1>
        </div>

        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="name">Item</label>
            <input type="text" onChange={this.handleInputChange}
                   ref={(input) => {this.nameInput = input; }}
                   id="name" name="name" value={this.state.draft.get("name")}/>
          </div>
          <div>
            <label htmlFor="qty">Quantity</label>
            <input type="number" min="1" step="1" onChange={this.handleInputChange}
                   id="qty" name="qty" value={this.state.draft.get("qty")}/>
          </div>
          <button className="button-primary">Add</button>
        </form>
        <table className="u-full-width">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {renderedItems}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
