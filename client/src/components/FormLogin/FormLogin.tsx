import React, { FC } from 'react';
import {
  Field,
  InjectedFormProps,
  reduxForm,
} from 'redux-form';
import {
  login,
  getErrorMessage,
  FormAuthValues,
  AuthState,
} from 'redux/modules/auth';
import { connect } from 'react-redux';
import ButtonMain from 'components/ButtonMain/ButtonMain';
import './FormLogin.css';
import { Link } from 'react-router-dom';
import FormAuth from 'components/FormAuth/FormAuth';
import { AppState } from 'redux/modules/rootReducer';

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  InjectedFormProps;

const FormLogin: FC<Props> = props => {
  const {
    handleSubmit,
    pristine,
    submitting,
    errorMessage,
  } = props;

  const submit = (values: FormAuthValues) => {
    props.login(values);
  };
  console.log(errorMessage);

  return (
    <div className={'form-login'}>
      <h1>Please login</h1>
      <FormAuth
        submitHandler={handleSubmit(submit)}
        pristine={pristine}
        submitting={submitting}
        errorMessage={errorMessage}
      />
      <div className="form-login__register">
        <p>
          Forgot your password?{' '}
          <Link to={'/reset-password'}>Reset it.</Link>
        </p>
        <p>
          Don't have an account?{' '}
          <Link to={'/register'}>Sign up.</Link>
        </p>
      </div>
    </div>
  );
};

function mapStateToProps({ auth }: AppState) {
  return {
    errorMessage: getErrorMessage(auth),
  };
}

const mapDispatchToProps: any = {
  login,
};

const reduxFormLogin = reduxForm({
  form: 'login', // a unique identifier for this form
})(FormLogin);

export default connect(
  mapStateToProps,
  { login }
)(reduxFormLogin);
