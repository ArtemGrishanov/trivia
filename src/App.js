import React from 'react';
import { connect } from 'react-redux'

import EngageApp from './lib/engage-ui/EngageApp';
import Screen from './lib/engage-ui/Screen';
import QuizBlock from './lib/engage-ui/blocks/quiz/QuizBlock';
import ResultBlock from './lib/engage-ui/blocks/quiz/ResultBlock';
import StartBlock from './lib/engage-ui/blocks/StartBlock'
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
        this.props.answer(optionId, this.props.questionHashlist, this.props.resultHashlist);
    }

    onRestart() {
        this.props.init(this.props.questionHashlist);
        this.setState({
            status: "start"
        });
    }

    render() {
        return (
            <EngageApp appHeight={this.props.height} appWidth={this.props.width} loading={this.props.loading}>
                {/* <ScreenManager> */}
                    {/* single screen */}
                    <Screen screenId="startScreen"
                            backgroundColor={this.props.startBackgroundColor}
                            if={(state) => { return !this.props.result && this.state.status === "start" }}>
                        <StartBlock onStart={this.onStart}></StartBlock>
                    </Screen>
                    {/* for many subling screens */}
                    {this.props.questions.map( (q, i) =>
                        <Screen screenId={"question"+i} key={i} group="questions" if={(state) => { return !this.props.result && this.state.status === "questions" && this.props.questionHashlist.getId(i) === this.props.questionIds[this.props.currentQuestionIndex]}}>
                            <QuizBlock
                                options={q.options}
                                key={this.props.questionHashlist.getId(i)}
                                text={q.text}
                                onOptionSelect={this.onOptionSelect}>
                            </QuizBlock>
                        </Screen>
                    )}
                    {/* single screen */}
                    <Screen screenId="resultId" if={(state) => { return this.props.result }}>
                        <ResultBlock
                            title={this.props.result ? this.props.result.title: null}
                            description={this.props.result ? this.props.result.description: null}
                            onRestart={this.onRestart}>
                        </ResultBlock>
                    </Screen>
                {/* </ScreenManager> */}
            </EngageApp>
        );
    }

    // render() {
    //     return <div></div>
    // }
}

const mapStateToProps = (state) => {
    return {
        currentQuestionIndex: state.session.currentQuestionIndex,
        questionIds: state.session.questionIds,
        width: state.app.size.width,
        height: state.app.size.height,
        loading: state.app.loading,
        questionHashlist: state.quiz.questions,
        questions: state.quiz.questions.toArray(),
        resultHashlist: state.quiz.results,
        results: state.quiz.results.toArray(),
        result: state.session.result ? state.quiz.results[state.session.result]: null,
        startBackgroundColor: state.style.startBackgroundColor
    }
}

const mapActionToProps = {
    init,
    answer
}

export default connect(mapStateToProps, mapActionToProps)(App);