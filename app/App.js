/**
 * Created by artem on 5/18/17.
 */


import React from 'react';
import {StyleSheet, View, Text, Image,
  TouchableOpacity, ActivityIndicator} from 'react-native';

export default class Fun extends React.Component {

  gagApiUrls = [
    {
      uri: 'https://api.imgflip.com/get_memes',
    }, {
      uri: 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=allgit',
      isSingle: true,
      tags: [] // TODO:
    }
  ];

  state = {
    isLoading: false,
    gags: [],
    currentGag: {},
    currentApi: 1,
    index: 0
  };

  updateInterval = '';
  updateTime = 1000 * 60 * 2;

  async getNewGags() {
    try {
      let response = await fetch(this.gagApiUrls[this.state.currentApi].uri,  {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      let data = await response.json();
      return data.data;
    } catch (error) {
      console.log('error', error)
    }
  }

  showGagFromChunk = () => {
    this.setState(curState => {
      let curIndex = curState.index;
      if (!curState.gags[curIndex]) {
        curIndex = 0;
      }
      return {
        currentGag: curState.gags[curIndex],
        index: ++curIndex
      }
    });
  };

  showGag = (gag) => {
    this.setState({
      currentGag: gag,
    })
  };

  updateGag = () => {
    this.setState({
      isLoading: true
    });

    this.getNewGags().then((gag) => {
      console.log('gaga', gag);
      this.showGag(gag);
    }).catch(e => console.log(e))
  };

  onImageLoad = () => {
    this.setState({
      isLoading: false
    })
  };

  componentWillMount() {
    // this.getNewGags().then((gags) => {
    //
    //   // TODO: if chunked
    //   // this.setState({
    //   //   gags: gags
    //   // });
    //
    //   this.showGag();
    //   this.updateInterval = setInterval(this.showGag, this.updateTime);
    // });

    this.updateInterval = setInterval(this.updateGag, this.updateTime);
    this.updateGag();
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  styles = StyleSheet.create({
    image: {
      flex: 1,
      resizeMode: 'contain'
    },
    text: {
      textAlign: 'center',
      backgroundColor: 'rgba(0,0,0,.3)',
      fontSize:20
    },
    centering : {
      // position: 'absolute',
      top: 100,
      justifyContent: 'center',
      alignItems: 'center'
    }
  });

  render() {
    // const {url, name, height, width} = this.state.currentGag;
    const {isLoading} = this.state;
    const {image_url, caption, id, width} = this.state.currentGag;

    return (
      <TouchableOpacity onPress={this.updateGag} style={{paddingTop: 20, flex: 1}}>
        <Image onLoad={this.onImageLoad} source={{uri: image_url}} style={this.styles.image}>
          <ActivityIndicator
            animating={this.state.isLoading}
            style={[this.styles.centering, {height: 80}]}
            size="large"
          />
        </Image>
        <Text style={this.styles.text}>{caption} {id}</Text>
      </TouchableOpacity>
    );
  }
}