import React from 'react';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: ''
    };
  }

  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value});
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value});
  }

  onSubmitSignIn = () => {
  /* Test for checking:  console.log('Sign-in attempt with email:', this.state.signInEmail);
    console.log('Sign-in attempt with password:', this.state.signInPassword); */

    fetch('https://facedetectback.onrender.com/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    })

      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(user => {
          console.log('Server response:', user); // Log server response  WORKING
        if (user.id) {
            this.props.loadUser(user); // Pass user data to loadUser WORKING
            this.props.onRouteChange('home');
        } else {
            console.log('Sign-in failed:', user); // Log failure
        }
    })
    .catch(error => console.log('Sign-in error:', error));
};
/*      .then(data => {
        console.log('Server response:', data); // Log the server response for debugging
        if (data.id) {
          this.props.onRouteChange('home');
        } else {
          console.log('Sign-in failed:', data); // Log any failure messages
        }
      })
     .catch(error => console.log('Sign-in error:', error));
     
  } */

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-3 center">
      <main className="pa4 black-80">
      <div className="measure">
        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
          <legend className="f1 fw6 ph0 mh0">Sign In</legend>
          <div className="mt3">
            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
            <input 
              className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
              type="email" 
              name="email-address"  
              id="email-address"
              onChange={this.onEmailChange} 
            />
          </div>
          <form className="mv3">
            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
            <input 
            className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
            type="password" 
            name="password"  
            id="password"
            onChange={this.onPasswordChange}
            />
          </form>
        </fieldset>
        <div className="">
          <input
          onClick={this.onSubmitSignIn} 
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
          type="submit" 
          value="Sign In"/>
        </div>
        <div className="lh-copy mt3">
          <p 
            onClick={() => onRouteChange('register')}
            className="f6 link dim black db pointer">
            Register
          </p>
        </div>
      </div>
    </main>
    </article>
  );
  }
}

export default SignIn;