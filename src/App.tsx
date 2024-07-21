/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';

import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Footer } from './components/Footer/Footer';
import { Errors } from './components/Errors/Errors';
import { IsActiveError, IsActiveLink } from './types/types';
import { TodosContext, ErrorContext } from './utils/Store';

export const App: React.FC = () => {
  const { todos, setTodos } = React.useContext(TodosContext);
  const { setIsError } = React.useContext(ErrorContext);

  const [link, setLink] = useState(IsActiveLink.All);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setIsError(IsActiveError.Load);
      });
  }, [setTodos, setIsError]);

  const visibleTodos = React.useMemo(() => {
    if (link === IsActiveLink.Active) {
      return todos.filter(t => !t.completed);
    }

    if (link === IsActiveLink.Completed) {
      return todos.filter(t => t.completed);
    }

    return todos;
  }, [link, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <Main filteredTodos={visibleTodos} />

        <Footer link={link} setLink={setLink} />
      </div>

      <Errors />
    </div>
  );
};
