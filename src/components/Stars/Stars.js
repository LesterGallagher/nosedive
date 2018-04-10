import React, { Component } from 'react';
import './Stars.css';
import { audio } from '../../global';
import { clamp, iterate } from '../../util';

class Stars extends Component {
  constructor(props) {
    super();
    this.state = {
      stars: props.stars && clamp(parseInt(props.stars)) || 0,
      readonly: props.readonly,
      rated: false,
    };
    if (!props.readonly) {
      this.finishStarRating = this.finishStarRating.bind(this);
      this.touchMove = this.touchMove.bind(this);
      iterate(1, 5, (n) => this['enterStar' + n] = this.enterStar.bind(this, n));
    }
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  render() {
    if (this.state.readonly) return this.renderReadonly();
    const starsClass = this.state.rated ? 'Stars Done' : 'Stars';
    return (
      <div ref={el => this.starsRef = el} className={starsClass} onTouchMove={this.touchMove} onTouchCancel={this.finishStarRating} onTouchEnd={this.finishStarRating}>
        <div className='StarsInner'>
          <div className='StarsWrapper'>
            <div className='MouseBeforeStar' onClick={this.finishStarRating} onTouchStart={this.enterStar1} onMouseEnter={this.enterStar1} />
            <div className='SingleStar' onClick={this.finishStarRating} onTouchStart={this.enterStar1} onMouseEnter={this.enterStar1}>{this.renderStar(this.state.stars > 0)}</div>
            <div className='SingleStar' onClick={this.finishStarRating} onTouchStart={this.enterStar2} onMouseEnter={this.enterStar2}>{this.renderStar(this.state.stars > 1)}</div>
            <div className='SingleStar' onClick={this.finishStarRating} onTouchStart={this.enterStar3} onMouseEnter={this.enterStar3}>{this.renderStar(this.state.stars > 2)}</div>
            <div className='SingleStar' onClick={this.finishStarRating} onTouchStart={this.enterStar4} onMouseEnter={this.enterStar4}>{this.renderStar(this.state.stars > 3)}</div>
            <div className='SingleStar' onClick={this.finishStarRating} onTouchStart={this.enterStar5} onMouseEnter={this.enterStar5}>{this.renderStar(this.state.stars > 4)}</div>
            <div className='MouseAfterStar' onClick={this.finishStarRating} onTouchStart={this.enterStar5} onMouseEnter={this.enterStar5} />
          </div>
        </div>
      </div>
    );
  }

  renderReadonly() {
    const starsClass = this.state.rated ? 'Stars Done' : 'Stars';
    return (
      <div ref={el => this.starsRef = el} className={starsClass}>
        <div className='StarsInner'>
          <div className='StarsWrapper'>
            <div className='MouseBeforeStar' />
            <div className='SingleStar' >{this.renderStar(this.state.stars > 0)}</div>
            <div className='SingleStar' >{this.renderStar(this.state.stars > 1)}</div>
            <div className='SingleStar' >{this.renderStar(this.state.stars > 2)}</div>
            <div className='SingleStar' >{this.renderStar(this.state.stars > 3)}</div>
            <div className='SingleStar' >{this.renderStar(this.state.stars > 4)}</div>
            <div className='MouseAfterStar' />
          </div>
        </div>
      </div>
    );
  }

  touchMove(e) {
    if (this.state.rated === true || this.state.readonly === true) return;
    var width = this.starsRef.offsetWidth;
    var x = e.changedTouches[0].pageX - this.starsRef.offsetLeft;
    var stars = clamp(Math.round(x / width * 5), 1, 5);
    if (this.state.stars !== stars) {
      this.setState({ stars });
    }
  }

  enterStar(stars, e) {
    if (this.state.rated === true || this.state.readonly === true) return;
    this.setState({ stars });
  }

  finishStarRating(e) {
    if (this.state.rated === true || this.state.readonly === true) return;
    audio['rate'].play();
    this.props.onFinish && this.props.onFinish(parseInt(this.state.stars, 10)/* make negative zero positive */);
    this.setState({ rated: true });
  }

  renderStar(active) {
    return <svg width='1792' height='1792' viewBox='0 0 1792 1792' xmlns='http://www.w3.org/2000/svg'>
      <path d='M1201 1004l306-297-422-62-189-382-189 382-422 62 306 297-73 421 378-199 377 199zm527-357q0 22-26 48l-363 354 86 500q1 7 1 20 0 50-41 50-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z' fill={active ? '#f95aff' : '#e0a8c1'} />
      <path d='M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z' fill={active ? '#f95aff' : '#c396ac'} />
    </svg>;
  }
}

export default Stars;
