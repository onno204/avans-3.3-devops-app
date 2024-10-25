import { v4 as uuidv4 } from 'uuid';
import { Project } from '../Project';
import { User } from '../../models/User';
import { BacklogItemState } from './states/BacklogItemState';
import { BacklogItemStateTodo } from './states/BacklogItemStateTodo';
import { BacklogItemStateDoing } from './states/BacklogItemStateDoing';
import { BacklogItemStateReadyForTesting } from './states/BacklogItemStateReadyForTesting';
import { BacklogItemStateTested } from './states/BacklogItemStateTested';
import { BacklogItemTask } from './BacklogItemTask';
import { BacklogItemStateTesting } from './states/BacklogItemStateTesting';
import { BacklogItemStateDone } from './states/BacklogItemStateDone';

export class BacklogItem {
  readonly id: string;
  currentState: BacklogItemState;
  readonly todoState: BacklogItemState;
  readonly doingState: BacklogItemState;
  readonly readyForTestingState: BacklogItemState;
  readonly testingState: BacklogItemState;
  readonly testedState: BacklogItemState;
  readonly doneState: BacklogItemState;

  constructor(
    public readonly project: Project,
    public readonly name: string,
    public readonly developer: User,
    public readonly subTasks: BacklogItemTask[] = []
  ) {
    this.id = uuidv4();

    this.todoState = new BacklogItemStateTodo(this);
    this.doingState = new BacklogItemStateDoing(this);
    this.readyForTestingState = new BacklogItemStateReadyForTesting(this);
    this.testingState = new BacklogItemStateTesting(this);
    this.testedState = new BacklogItemStateTested(this);
    this.doneState = new BacklogItemStateDone(this);

    this.currentState = this.todoState;
  }

  areAllTasksFinished(): boolean {
    return this.subTasks.every((task) => task.isDone);
  }

  isFinished(): boolean {
    return this.currentState instanceof BacklogItemStateDone;
  }

  // ########################################
  // # State specific functions
  // ########################################
  changeState(newState: BacklogItemState, user: User): boolean {
    if (!newState.canChangedToThisState(user)) {
      return false;
    }
    this.currentState = newState;
    this.currentState.onEnterState(user);

    return true;
  }

  moveToTodo(user: User): boolean {
    return this.currentState.moveToTodo(user);
  }
  moveToDoing(user: User): boolean {
    return this.currentState.moveToDoing(user);
  }
  moveToReadyForTesting(user: User): boolean {
    return this.currentState.moveToReadyForTesting(user);
  }
  moveToTesting(user: User): boolean {
    return this.currentState.moveToTesting(user);
  }
  moveToTested(user: User): boolean {
    return this.currentState.moveToTested(user);
  }
  moveToDone(user: User): boolean {
    return this.currentState.moveToDone(user);
  }
}
