import axios from "axios";
import { Dispatch } from "redux";
import {
  Action,
  UpdateCellAction,
  DeleteCellAction,
  MoveCellAction,
  InsertCellAfterAction,
  Direction,
} from "../actions";
import { ActionType } from "../action-types";
import { RootState } from "./../reducers";
import { Cell, CellTypes } from "../cell";
import bundle from "../../bundler";

export const updateCell = (id: string, content: string): UpdateCellAction => ({
  type: ActionType.UPDATE_CELL,
  payload: {
    id,
    content,
  },
});

export const deleteCell = (id: string): DeleteCellAction => ({
  type: ActionType.DELETE_CELL,
  payload: id,
});

export const moveCell = (id: string, direction: Direction): MoveCellAction => ({
  type: ActionType.MOVE_CELL,
  payload: {
    id,
    direction,
  },
});

export const insertCellAfter = (
  id: string | null,
  cellType: CellTypes
): InsertCellAfterAction => ({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id,
    type: cellType,
  },
});

export const createBundle = (cellId: string, input: string) => async (
  dispatch: Dispatch<Action>
) => {
  dispatch({
    type: ActionType.BUNDLE_START,
    payload: {
      cellId,
    },
  });

  const result = await bundle(input);

  dispatch({
    type: ActionType.BUNDLE_COMPLETE,
    payload: {
      cellId,
      bundle: result,
    },
  });
};

export const fetchCells = () => async (dispatch: Dispatch<Action>) => {
  dispatch({ type: ActionType.FETCH_CELLS });

  try {
    const { data } = await axios.get<Cell[]>("/cells");

    dispatch({ type: ActionType.FETCH_CELLS_COMPLETE, payload: data });
  } catch (err) {
    if (err instanceof Error) {
      dispatch({ type: ActionType.FETCH_CELLS_ERROR, payload: err.message });
    }
  }
};

export const savaCells = () => async (
  dispatch: Dispatch<Action>,
  getState: () => RootState
) => {
  const {
    cells: { data, order },
  } = getState();

  const cells = order.map((id) => data[id]);

  try {
    await axios.post("/cells", { cells });
  } catch (err) {
    if (err instanceof Error) {
      dispatch({ type: ActionType.SAVE_CELLS_ERROR, payload: err.message });
    }
  }
};
