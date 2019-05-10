import React from 'react';
import { connect } from 'react-redux'
import ReactDOMServer from 'react-dom/server';

import EngageApp from './lib/engage-ui/EngageApp';
import QuizSlide from './lib/engage-ui/quiz/QuizSlide';
import ResultSlide from './lib/engage-ui/quiz/ResultSlide';
import StartScreen from './screens/StartScreen'
import {answer, init} from './actions'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: "start"
        }
        this.onStart = this.onStart.bind(this);
        this.onOptionSelect = this.onOptionSelect.bind(this);
        this.onRestart = this.onRestart.bind(this);
    }

    onStart() {
        this.setState({
            status: "questions"
        });
    }

    onOptionSelect(optionId) {
        console.log('TODO calc points here '+ optionId);
        //TODO fake transition
        this.props.answer(optionId);
        // this.setState({
        //     status: "result"
        // });
    }

    onRestart() {
        this.props.init();
        this.setState({
            status: "start"
        });
    }

    render() {
        return (
            <EngageApp appHeight={this.props.height} appWidth={this.props.width} loading={this.props.loading}>
                {!this.props.result && this.state.status === "start" &&
                    <StartScreen onStart={this.onStart}></StartScreen>
                }
                {!this.props.result && this.state.status === "questions" &&
                    this.props.questions.map( (q, i) => <QuizSlide options={q.options} key={i} text={q.text} onOptionSelect={this.onOptionSelect}></QuizSlide> )
                }
                {this.props.result &&
                    <ResultSlide title={this.props.result.title} description={this.props.result.description} onRestart={this.onRestart}></ResultSlide>
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
        questions: state.quiz.questions.toArray(),
        results: state.quiz.results.toArray(),
        result: state.quiz.result ? state.quiz.results[state.quiz.result]: null
    }
}

const mapActionToProps = {
    init,
    answer
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

export default connect(mapStateToProps, mapActionToProps)(App);
