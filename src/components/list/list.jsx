import React, { Component } from 'react';
import './styles.css';

class List extends Component {
  state = { value: '', hoverableItem: null };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  hoverOn = id => {
    this.setState({ hoverableItem: id });
  };

  hoverOff = () => {
    this.setState({ hoverableItem: null });
  };

  render() {
    const { indexFirstTask, indexLastTask } = this.props.edgeItems;
    const tasks = this.props.showFiltered ? this.props.filteredTasks : this.props.tasks;

    return tasks.length ? (
      <ul className="List">
        {tasks.map((task, i) => {
          if (i >= indexFirstTask && i <= indexLastTask) {
            if (task.onEdit) {
              return (
                <li className="tasks" key={task.timeId}>
                  <input
                    type="checkbox"
                    checked={task.isChecked}
                    onChange={e => this.props.markChecked(task.timeId, e)}
                  />
                  <input
                    type="text"
                    placeholder="New task..."
                    value={this.state.value}
                    onChange={this.handleChange}
                  />
                  <input
                    type="checkbox"
                    checked={task.isDone}
                    onChange={e => this.props.markTask(task.timeId, e)}
                  />
                  <button
                    onClick={() => this.props.submitChangeTask(this.state.value, task.timeId)}
                  >
                    Save
                  </button>
                  <button onClick={() => this.props.onEdit(task.timeId)}>Cancel</button>
                </li>
              );
            } else if (this.state.hoverableItem === task.timeId) {
              return (
                <li className="tasks" key={task.timeId} onMouseLeave={this.hoverOff}>
                  <input
                    type="checkbox"
                    checked={task.isChecked}
                    onChange={e => this.props.markChecked(task.timeId, e)}
                  />
                  <span className={task.isDone ? 'marked-title' : 'regular-title'}>
                    {task.task}
                  </span>
                  <input
                    type="checkbox"
                    checked={task.isDone}
                    onChange={e => this.props.markTask(task.timeId, e)}
                  />
                  <button className="Edit-button" onClick={() => this.props.onEdit(task.timeId)}>
                    Edit
                  </button>
                  <button
                    className="Delete-button"
                    onClick={() => this.props.removeTask(task.timeId)}
                  >
                    Remove
                  </button>
                </li>
              );
            } else
              return (
                <li
                  className="tasks"
                  key={task.timeId}
                  onMouseEnter={() => this.hoverOn(task.timeId)}
                >
                  <input
                    type="checkbox"
                    checked={task.isChecked}
                    onChange={e => this.props.markChecked(task.timeId, e)}
                  />
                  <span className={task.isDone ? 'marked-title' : 'regular-title'}>
                    {task.task}
                  </span>
                </li>
              );
          }
          return null;
        })}
      </ul>
    ) : (
      <h3 style={{ textAlign: 'center' }}>No tasks yet</h3>
    );
  }
}

export default List;
