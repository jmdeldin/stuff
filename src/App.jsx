import React, { Component } from 'react';
import './vendor/normalize.css';
import './vendor/skeleton.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draft: this.freshDraft(),
      items: this.fetchItems()
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.flushDatabase = this.flushDatabase.bind(this);
  }

  handleInputChange(event) {
    let target = event.target,
        value = target.value,
        name = target.name,
        draft = this.state.draft;

    if (name === "name" || name === "qty") {
      draft[name] = value;
    }

    this.setState({draft: draft});
  }

  isValid() {
    let draft = this.state.draft;

    return draft.name !== "" && draft.qty > 0;
  }

  cloneMap(map) {
    return Object.assign({}, map);
  }

  addItem() {
    let items = this.cloneMap(this.state.items),
        draft = this.state.draft,
        existing = items[draft.name];

    if (existing) {
      existing.qty = parseInt(existing.qty, 10) + 1;
    } else {
      items[draft.name] = {qty: draft.qty};
    }

    this.setState({draft: this.freshDraft(), items: items}, this.persistItems);
  }

  persistItems() {
    localStorage.setItem("items", JSON.stringify(this.state.items));
  }

  fetchItems() {
    let items = JSON.parse(localStorage.getItem("items"));
    return items ? items : [];
  }

  flushDatabase() {
    if (confirm("This will delete all of your saved items. Continue?")) {
      localStorage.clear()
    }
    this.focusField();
  }

  uuid() {
    return crypto.getRandomValues(new Uint32Array(4)).join('-');
  }

  freshDraft() {
    return {name: "", qty: 1};
  }

  resetDraft() {
    this.setState({draft: this.freshDraft()});
  }

  focusField() {
    this.nameInput.focus();
  }

  handleSubmit(event) {
    if (this.isValid()) {
      this.addItem();
    }

    this.focusField();
    event.preventDefault();
  }

  removeItem(name) {
    let items = this.cloneMap(this.state.items);
    if (items[name]) {
      delete items[name];
    }
    this.setState({items: items});
  }

  render() {
    let renderedItems = [];
    for (let name in this.state.items) {
      renderedItems.push(
        <tr key={name}>
          <td>{name}</td>
          <td>{this.state.items[name].qty}</td>
          <td>
            <button onClick={this.removeItem.bind(this, name)}>Remove</button>
          </td>
        </tr>
      );
    }

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
                   id="name" name="name" value={this.state.draft.name}/>
          </div>

          <div>
            <label htmlFor="qty">Quantity</label>
            <input type="number" min="1" step="1" onChange={this.handleInputChange}
                   id="qty" name="qty" value={this.state.draft.qty}/>
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
        <div>
          <button className="danger" onClick={this.flushDatabase}>Reset</button>
        </div>
      </div>
    );
  }
}

export default App;
