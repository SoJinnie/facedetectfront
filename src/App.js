import React, {Component} from 'react';
import './App.css';
import Particles from './components/Particles/Particles';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route:'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: '',
    joined: ''
  }
}
  
class App extends Component {

    constructor(input) {

        super(input);
        this.state = initialState;
      }

      loadUser = (data) => {
        this.setState({user: {
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
      }})
      }

   /*    componentDidMount() {
        fetch('http://localhost:3000')
        .then(response => response.json())
        .then(console.log)
      } */

    calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      
      // Adjust calculations to make the bounding box more accurate
      return {
        topRow: clarifaiFace.top_row * height,     // Slightly reduce the top row
        leftCol: clarifaiFace.left_col * width,    // Slightly reduce the left column
        bottomRow: height - (clarifaiFace.bottom_row * height), // Slightly increase the bottom row
        rightCol: width - (clarifaiFace.right_col * width) // Slightly increase the right column
      };
  }

    displayFaceBox = (box) => {
        this.setState({box: box});
    }

    onInputChange = (event) => {
      this.setState({input: event.target.value});
    }

    onSubmit = () => {
      this.setState({ imageUrl: this.state.input });
      fetch(/* 'http://localhost:3000/clarifai'  */ 'https://facedetectback.onrender.com/clarifai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: this.state.input })
      })
          .then(response => response.json())
          .then(response => {
               console.log('Face detection response:', response);
              if (response) {
                  this.displayFaceBox(this.calculateFaceLocation(response));
                  fetch( /* 'http://localhost:3000/image' */'https://facedetectback.onrender.com/image', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: this.state.user.id })
                  })
                      .then(response => response.json())
                      .then(count => {
                          this.setState(Object.assign(this.state.user, { userentries: count }));
                      })
                      .catch(err => console.log('Error updating entries:', err));
              }
          })
          .then(result => {
            const regions = result.outputs[0].data.regions;
            
            // If there's at least one face detected, process the first bounding box
            if (regions && regions.length > 0) {
              const boundingBox = regions[0].region_info.bounding_box;
              const box = {
                    topRow: boundingBox.top_row * 100,
                    leftCol: boundingBox.left_col * 100,
                    bottomRow: boundingBox.bottom_row * 100,
                    rightCol: boundingBox.right_col * 100
                };
                this.displayFaceBox(box); // Update state to display this box
              }
                          
            // Log details for each region (optional)/* 
            regions.forEach(region => {
              const boundingBox = region.region_info.bounding_box;
              const topRow = boundingBox.top_row.toFixed(3);
              const leftCol = boundingBox.left_col.toFixed(3);
              const bottomRow = boundingBox.bottom_row.toFixed(3);
              const rightCol = boundingBox.right_col.toFixed(3);
              
            region.data.concepts.forEach(concept => {
              const name = concept.name;
              const value = concept.value.toFixed(4);
              console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
              });
            });
          })
        .catch(error => console.log('error', error));
}

    onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState(initialState)
  } else if (route === 'home') {
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

render() {
  const { isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
    <Particles className='particles' />
    <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
    { route === 'home'
      ? <div>
          <Logo />
          <Rank
            username={this.state.user.name}
            userentries={this.state.user.entries}
          />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onSubmit={this.onSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      : (
         route === 'signin'
         ? <SignIn loadUser ={this.loadUser} onRouteChange={this.onRouteChange}/>
         : <Register loadUser ={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
    }
  </div>
);
}}

export default App;