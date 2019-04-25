import React, { FunctionComponent, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import List, { ListProps } from 'components/List/List';
import {
  mapStateToProps,
  mapDispatchToProps,
} from 'components/ListsContainer/ListsContainer';

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

const ListsDND: FunctionComponent<Props> = props => {
  const {
    getLists,
    updateListTasks,
    boardId,
    lists,
    listIds,
    order,
    getListsAndTasks,
    resetLists,
    updateListsOrderAndSendToServer,
  } = props;

  useEffect(() => {
    getLists(listIds);
    return function cleanup() {
      resetLists();
    };
  }, []);

  function onDragEnd(result: DropResult) {
    const {
      destination,
      source,
      draggableId,
      type,
    } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === `LIST`) {
      const newListOrder = Array.from(order);
      newListOrder.splice(source.index, 1);
      newListOrder.splice(
        destination.index,
        0,
        draggableId
      );

      updateListsOrderAndSendToServer(
        boardId,
        draggableId,
        newListOrder
      );
      return;
    }

    const start: ListProps = lists[source.droppableId];
    const finish: ListProps =
      lists[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newList = {
        ...start,
        taskIds: newTaskIds,
      };

      // updateListTasks(newList.id, newList);
      return;
    }

    // moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartList = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishList = {
      ...finish,
      taskIds: finishTaskIds,
    };
    // update both lists
    // updateListTasks(
    //   newStartList.id,
    //   newStartList
    // );
    // updateListTasks(
    //   newFinishList.id,
    //   newFinishList
    // );
  }

  return (
    <>
      {
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId={`board`}
            direction={`horizontal`}
            type={`LIST`}
          >
            {provided => (
              <div
                className={`d-inline-flex`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {order.map((listId: any, index: any) => {
                  return (
                    <List
                      key={listId}
                      loading={true}
                      stateId={listId}
                      {...lists[listId]}
                      index={index}
                    />
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      }
    </>
  );
};

export default ListsDND;