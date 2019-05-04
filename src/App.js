import React from 'react';
import { connect } from 'react-redux'
import ReactDOMServer from 'react-dom/server';

import EngageApp from './lib/engage-ui/EngageApp';
import QuizSlide from './lib/engage-ui/quiz/QuizSlide';
import StartScreen from './screens/StartScreen'


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: "start"
        }
        this.onStart = this.onStart.bind(this);
    }

    onStart() {
        this.setState({
            status: "questions"
        });
    }

    render() {
        return (
            <EngageApp appHeight={this.props.height} appWidth={this.props.width} loading={this.props.loading}>
                {this.state.status === "start" &&
                    <StartScreen onStart={this.onStart}></StartScreen>
                }
                {this.state.status === "questions" &&
                    this.props.questions.map( (q, i) => <QuizSlide options={q.options} key={i} text={q.text}></QuizSlide> )
                }
            </EngageApp>
        );
    }
}

const mapStateToProps = (state) => {
    mapStateToLogicScreens(state);
    return {
        width: state.app.size.width,
        height: state.app.size.height,
        loading: state.app.loading,
        questions: state.quiz.questions.toArray()
    }
}

const mapStateToLogicScreens = (state) => {
    const screens = [];
    screens.push(<StartScreen></StartScreen>);
    state.quiz.questions.toArray().map( (question) =>
        screens.push(<QuizSlide question={question}></QuizSlide>)
    )
    console.log('>>>>> mapStateToLogicScreens: ', screens);
    console.log(ReactDOMServer.renderToStaticMarkup(screens[0]));

    //TODO compare prev html strings

    //TODO sync screens count -> create, delete events

    //TODO how to integrate this func with remix SDK
}

export default connect(mapStateToProps)(App);
