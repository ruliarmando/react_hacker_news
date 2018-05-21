import React, { Component } from 'react';
import timeago from 'epoch-timeago';

import logo from './y18.gif';
import './App.css';

class App extends Component {
  state = {
    loading: true,
    topItemIds: [],
    topItemObjects: [],
  }

  async componentDidMount() {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const idsJson = await response.json();
    const itemsPromise = idsJson.slice(0, 20).map(id => {
      return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      .then(response => response.json())
      .then(json => json);
    });
    const items = await Promise.all(itemsPromise);
    this.setState({ topItemIds: idsJson, topItemObjects: items, loading: false });
  }

  render() {
    return (
      <div className="container">
        <div className="inner-container">
          <div className="header">
            <div className="logo-container">
              <img src={logo} alt="logo" />
            </div>
            <a className="brand" href="/">Hacker News</a>
            <span>
              new | comments | show | ask | jobs | submit
            </span>
            <span className="login">login</span>
          </div>
          <div className="content">
            {
              this.state.loading ? (
                <h3>Loading...</h3>
              ) : (
                  <ol className="list">
                    {this.state.topItemObjects.map((item, i) => (
                      <li key={i} className="item">
                        <div>
                          <a href={item.url} target="_blank" className="links">{item.title}</a>{' '}
                          <span className="site-url">
                            <a
                              href={`https://news.ycombinator.com/from?site=${item.url.split('/')[2]}`}
                              target="_blank"
                            >
                              ({item.url.split('/')[2]})
                              </a>
                          </span>
                        </div>
                        <div>
                          <span className="sub">
                            {item.score} points by {item.by} {timeago(item.time * 1000)} | hide | {item.kids ? `${item.kids.length} comments` : 'discuss'}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
