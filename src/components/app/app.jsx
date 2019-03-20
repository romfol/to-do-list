import React, { Component } from 'react';
import { ShowingAndSortingButtons } from '../showing-sortingButtons/showing-sortingButtons';
import List from '../list/list';
import { CheckingButtons } from '../checkingButtons/checkingButtons';
import Pagination from '../pagination/pagination';

import './styles.css';

class App extends Component {
  state = {
    value: '',
    tasks: [],
    showFiltered: false,
    filteredTasks: [],
    edgeItems: { indexFirstTask: 0, indexLastTask: 9 },
  };

  setEdgeTasksToShow = (currentPage = 1) => {
    const tasksPerPage = 10;
    const indexDifferFromFirstToLast = 9;
    const indexLastTask = currentPage * tasksPerPage - 1;
    const indexFirstTask = indexLastTask - indexDifferFromFirstToLast;
    this.setState({ edgeItems: { indexFirstTask, indexLastTask } });
  };

  sortByDate = () => {
    const sortedTasks = this.state.showFiltered
      ? [...this.state.filteredTasks]
      : [...this.state.tasks];
    sortedTasks.sort((a, b) => a.timeId - b.timeId);
    this.state.showFiltered
      ? this.setState({ filteredTasks: sortedTasks })
      : this.setState({ tasks: sortedTasks });
  };

  sortByTitle = () => {
    const sortedTasks = this.state.showFiltered
      ? [...this.state.filteredTasks]
      : [...this.state.tasks];
    sortedTasks.sort((a, b) => {
      const taskA = a.task.toUpperCase();
      const taskB = b.task.toUpperCase();
      if (taskA < taskB) {
        return -1;
      }
      if (taskA > taskB) {
        return 1;
      }
      return 0;
    });

    this.state.showFiltered
      ? this.setState({ filteredTasks: sortedTasks })
      : this.setState({ tasks: sortedTasks });
  };

  showAll = () => {
    this.setState({ showFiltered: false });
  };

  showActive = () => {
    const activeTasks = this.state.tasks.filter(task => !task.isDone);
    this.setState({ showFiltered: true, filteredTasks: activeTasks });
  };

  showCompleted = () => {
    const completedTasks = this.state.tasks.filter(task => task.isDone);
    this.setState({ showFiltered: true, filteredTasks: completedTasks });
  };

  markChecked = (id, e) => {
    this.state.tasks.forEach((task, i) => {
      if (task.timeId === id) {
        const markedTask = [...this.state.tasks];
        markedTask[i].isChecked = e.target.checked;
        this.setState({ tasks: markedTask });
      }
    });
  };

  deleteChecked = () => {
    const newFilteredTasks = [...this.state.filteredTasks].filter(task => !task.isChecked);
    const newTasks = [...this.state.tasks].filter(task => !task.isChecked);

    console.log(newFilteredTasks, newTasks);
    this.setState({
      tasks: newTasks,
      filteredTasks: newFilteredTasks,
    });
  };

  uncheckAll = () => {
    const { indexFirstTask, indexLastTask } = this.state.edgeItems;
    if (!this.state.showFiltered) {
      const uncheckedAll = [...this.state.tasks];

      uncheckedAll.forEach((item, i) => {
        if (i >= indexFirstTask && i <= indexLastTask) {
          uncheckedAll[i].isChecked = false;
        }
      });
      this.setState({ tasks: uncheckedAll });
    } else {
      const uncheckedAll = [...this.state.filteredTasks];
      uncheckedAll.forEach((item, i) => {
        if (i >= indexFirstTask && i <= indexLastTask) {
          uncheckedAll[i].isChecked = false;
        }
      });
      this.setState({ filteredTasks: uncheckedAll });
    }
  };

  checkAll = () => {
    const { indexFirstTask, indexLastTask } = this.state.edgeItems;
    if (!this.state.showFiltered) {
      const checkedAll = [...this.state.tasks];
      checkedAll.forEach((item, i) => {
        if (i >= indexFirstTask && i <= indexLastTask) {
          checkedAll[i].isChecked = true;
        }
      });
      this.setState({ tasks: checkedAll });
    } else {
      const checkedAll = [...this.state.filteredTasks];
      checkedAll.forEach((item, i) => {
        if (i >= indexFirstTask && i <= indexLastTask) {
          checkedAll[i].isChecked = true;
        }
      });
      this.setState({ filteredTasks: checkedAll });
    }
  };

  submitChangeTask = (newTask, id) => {
    this.state.tasks.forEach((task, i) => {
      if (task.timeId === id) {
        const newTasks = [...this.state.tasks];
        newTasks[i].task = newTask;
        newTasks[i].onEdit = !newTasks[i].onEdit;
        this.setState({ tasks: newTasks });
      }
    });
  };

  onEdit = id => {
    this.state.tasks.forEach((task, i) => {
      if (task.timeId === id) {
        const editingTasks = [...this.state.tasks];
        editingTasks[i].onEdit = !editingTasks[i].onEdit;
        this.setState({ tasks: editingTasks });
      }
    });
  };

  removeTask = id => {
    const newTasks = this.state.tasks.filter(task => task.timeId !== id);
    const filteredTasks = this.state.filteredTasks.filter(task => task.timeId !== id);
    this.setState({
      tasks: newTasks,
      filteredTasks,
    });
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

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.setState({
      tasks: this.state.tasks.concat({
        task: this.state.value,
        timeId: +new Date(),
        isDone: false,
        onEdit: false,
        isChecked: false,
      }),
      value: '',
    });
  };

  render() {
    return (
      <div className="App">
        <ShowingAndSortingButtons
          showAll={this.showAll}
          showActive={this.showActive}
          showCompleted={this.showCompleted}
          sortByDate={this.sortByDate}
          sortByTitle={this.sortByTitle}
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
            setEdgeTasksToShow={this.setEdgeTasksToShow}
            edgeItems={this.state.edgeItems}
            tasks={this.state.tasks}
            showFiltered={this.state.showFiltered}
            filteredTasks={this.state.filteredTasks}
            removeTask={this.removeTask}
            markTask={this.markTask}
            onEdit={this.onEdit}
            submitChangeTask={this.submitChangeTask}
            cancelChangeTask={this.cancelChangeTask}
            markChecked={this.markChecked}
          />
          <Pagination
            tasks={this.state.tasks}
            setEdgeTasksToShow={this.setEdgeTasksToShow}
            showFiltered={this.state.showFiltered}
            filteredTasks={this.state.filteredTasks}
          />
        </div>
      </div>
    );
  }
}

export default App;
