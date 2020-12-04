import React from 'react';

// import ReactDOM from 'react-dom';
//const element = (<h1>Test123</h1>);

//export const Main = () => ( <h1>Test123</h1> );

interface ClockProps {
  title: string;
}

interface ClockState {
  date: Date;
}

export class Clock extends React.Component<ClockProps, ClockState> {
  private timerID?: number; // NodeJS.Timeout;

  constructor(props: ClockProps) {
    super(props);
    console.log(props.title);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }

  tick() {
    () => {
      this.setState({
        date: new Date(),
      });
    };
    ///console.log("Hello");
    // this.setState({
    //   date: new Date()
    // });
    //let a: TimerHandler = "";
    //return a;
  }

  render() {
    return (
      <div>
        <h1>Привет, мир! {this.props.title} </h1>
        <h2>Сейчас {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
