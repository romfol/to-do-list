import React, { Component } from 'react';
import { ShowingAndSortingButtons } from '../showing-sortingButtons/showing-sortingButtons';
import List from '../list/list';
import { CheckingButtons } from '../checkingButtons/checkingButtons';
import Pagination from '../pagination/pagination';
import templateList from '../../itemsList';
import { sortTasks, filterTasks } from '../../services';

import './styles.css';

class App extends Component {
  state = {
    value: '',
    tasks: templateList,
    items: [],
    filteredAndSorted: [],
    onEdit: 0,
    isChecked: [],
    showActive: false,
    showCompleted: false,
    sortByTitle: false,
    loaded: false,
    activePage: 1,
  };

  componentDidMount() {
    new Promise(resolve => setTimeout(resolve, 2000)).then(() => {
      this.setState({ loaded: true });
      return this.showProcessedResult();
    });
  }

  // componentDidUpdate() {
  //   const {
  //     filteredItems,
  //     edgeItems: { indexFirstTask },
  //   } = this.state;
  //   if (filteredItems.length && filteredItems.length - 1 < indexFirstTask) {
  //     this.setEdgeTasksToShow();
  //   }
  // }

  markChecked = id => {
    const checked = [...this.state.isChecked];
    if (!checked.includes(id)) {
      this.setState({ isChecked: [...checked, id] });
    } else {
      checked.splice(checked.indexOf(id), 1);
      this.setState({ isChecked: checked });
    }
  };

  deleteChecked = () => {
    const {
      tasks,
      isChecked,
      edgeItems: { indexFirstTask, indexLastTask },
      // filteredItems,
    } = this.state;
    const checked = [];

    const newTasks = tasks.filter((task, i) => {
      //console.log(!isChecked.includes(task.timeId), i <= indexFirstTask, indexLastTask <= i);
      return !isChecked.includes(task.timeId) || i < indexFirstTask || indexLastTask < i;
    });

    newTasks.forEach(item => {
      if (isChecked.includes(item.timeId)) {
        checked.push(item.timeId);
      }
    });

    this.setState(
      {
        tasks: newTasks,
        isChecked: checked,
      },
      () => this.showProcessedResult()
    );
  };

  uncheckAll = () => {
    const {
      edgeItems: { indexFirstTask, indexLastTask },
      items,
      isChecked,
    } = this.state;
    const checked = [...isChecked];

    items.forEach((item, i) => {
      if (i >= indexFirstTask && i <= indexLastTask && checked.includes(item.timeId)) {
        checked.splice(checked.indexOf(item.timeId), 1);
      }
    });
    this.setState({ isChecked: [...checked] });
  };

  checkAll = () => {
    const {
      edgeItems: { indexFirstTask, indexLastTask },
      isChecked,
      items,
    } = this.state;

    const checkedItems = [];
    items.forEach((item, i) => {
      if (i >= indexFirstTask && i <= indexLastTask && !isChecked.includes(item.timeId)) {
        checkedItems.push(items[i].timeId);
      }
    });
    this.setState({ isChecked: [...isChecked, ...checkedItems] });
  };

  submitChangeTask = (newTask, id) => {
    this.state.tasks.forEach((task, i) => {
      if (task.timeId === id) {
        const newTasks = [...this.state.tasks];
        newTasks[i].task = newTask;
        this.setState({ tasks: newTasks, onEdit: 0 });
      }
    });
  };

  notOnEdit = () => {
    this.setState({
      onEdit: 0,
    });
  };

  onEdit = id => {
    this.setState({
      onEdit: id,
    });
  };

  removeTask = id => {
    const { tasks, isChecked } = this.state;
    const checked = [...isChecked];

    const newList = tasks.filter(task => task.timeId !== id);
    if (checked.includes(id)) checked.splice(checked.indexOf(id), 1);

    this.setState(
      {
        tasks: newList,
        isChecked: checked,
      },
      () => this.showProcessedResult()
    );
  };

  markTask = (id, e) => {
    this.state.tasks.forEach((task, i) => {
      if (task.timeId === id) {
        const markedTasks = [...this.state.tasks];
        markedTasks[i].isDone = e.target.checked;
        this.setState({ tasks: markedTasks });
      }
    });
  };

  showingAll = () => {
    this.setState({ showActive: false, showCompleted: false }, () => this.showProcessedResult());
  };

  showingActive = () => {
    this.setState({ showActive: true, showCompleted: false }, () => this.showProcessedResult());
  };

  showingCompleted = () => {
    this.setState({ showActive: false, showCompleted: true }, () => this.showProcessedResult());
  };
  dateSort = () => {
    this.setState({ sortByTitle: false }, () => this.showProcessedResult());
  };

  titleSort = () => {
    this.setState({ sortByTitle: true }, () => this.showProcessedResult());
  };

  pagination = activePage => {
    this.setState({ activePage }, () => this.showProcessedResult());
  };

  showProcessedResult = (currentPage = this.state.activePage) => {
    const { showActive, showCompleted, sortByTitle, tasks } = this.state;
    const allItems = [...tasks];

    const filteredAndSorted = sortTasks(
      filterTasks(allItems, showActive, showCompleted),
      sortByTitle
    );
    this.setState({ filteredAndSorted });

    const pagination = (allItems, currentPage) => {
      const tasksPerPage = 10;
      const differIndexFromFirstToLast = 9;
      const indexLastTask = currentPage * tasksPerPage - 1;
      const indexFirstTask = indexLastTask - differIndexFromFirstToLast;

      const filledPages = Math.ceil(filteredAndSorted.length / 10);
      if (this.state.activePage > filledPages) {
        this.setState({ activePage: filledPages });
      }

      return allItems.filter((e, i) => indexFirstTask <= i && i <= indexLastTask);
    };

    const result = pagination(filteredAndSorted, currentPage);

    this.setState({ items: result });
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.setState(
      {
        tasks: [
          ...this.state.tasks,
          {
            task: this.state.value,
            timeId: Date.now(),
            isDone: false,
          },
        ],
        onEdit: null,
        isChecked: [],
        value: '',
      },
      () => this.showProcessedResult()
    );
  };

  render() {
    return (
      <div className="App">
        <ShowingAndSortingButtons
          showingAll={this.showingAll}
          showingActive={this.showingActive}
          showingCompleted={this.showingCompleted}
          dateSort={this.dateSort}
          titleSort={this.titleSort}
        />
        <div>
          <h1 className="Title">
            <span>TO-DO LIST</span>
          </h1>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="Task..."
              value={this.state.value}
              onChange={this.handleChange}
              className="Input"
              required
            />
            <button className="add-button" type="submit" value="Submit">
              ADD NEW TASK
            </button>
          </form>
          <CheckingButtons
            checkAll={this.checkAll}
            deleteChecked={this.deleteChecked}
            uncheckAll={this.uncheckAll}
          />
          <List
            loaded={this.state.loaded}
            showProcessedResult={this.showProcessedResult}
            isChecked={this.state.isChecked}
            notOnEdit={this.notOnEdit}
            onEditItem={this.state.onEdit}
            edgeItems={this.state.edgeItems}
            items={this.state.items}
            removeTask={this.removeTask}
            markTask={this.markTask}
            onEdit={this.onEdit}
            submitChangeTask={this.submitChangeTask}
            markChecked={this.markChecked}
          />
          <Pagination
            activePage={this.state.activePage}
            pagination={this.pagination}
            filteredAndSorted={this.state.filteredAndSorted}
          />
        </div>
      </div>
    );
  }
}

export default App;
