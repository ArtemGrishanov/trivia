import React from 'react'
import { connect } from 'react-redux'

import EngageApp from './lib/engage-ui/EngageApp'
import Screen from './lib/engage-ui/Screen'
import actions, { answer, init } from './actions'
import TextOption from './lib/engage-ui/primitives/TextOption'
import Button from './lib/engage-ui/primitives/Button'
import Text from './lib/engage-ui/primitives/Text'
import ProgressiveImage from './lib/engage-ui/primitives/ProgressiveImage'
import LayoutContainer from './lib/engage-ui/layout/LayoutContainer'
import LayoutItem from './lib/engage-ui/layout/LayoutItem'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: 'start',
        }
        this.onStart = this.onStart.bind(this)
        this.onOptionSelect = this.onOptionSelect.bind(this)
        this.onRestart = this.onRestart.bind(this)
    }

    onStart() {
        this.setState({
            status: 'questions',
        })
    }

    onOptionSelect(optionId) {
        this.props.answer(optionId, this.props.questionHashlist, this.props.resultHashlist)
    }

    onRestart() {
        this.props.init(this.props.questionHashlist)
        this.setState({
            status: 'start',
        })
    }

    renderOld() {
        return (
            <EngageApp appHeight={this.props.height} appWidth={this.props.width} loading={this.props.loading}>
                {/* <ScreenManager> */}
                {/* single screen */}
                {/* <Screen screenId="startScreen"
                            backgroundColor={this.props.startBackgroundColor}
                            if={(state) => { return !this.props.result && this.state.status === "start" }}>
                        <StartBlock onStart={this.onStart}></StartBlock>

                        <LayoutContainer globalTestId="question1" layout='{"642":{"elements":[{"selector":"Option","top":7,"left":0,"width":12.62169003115265,"height":47},{"selector":"Option","top":23,"left":33.41121495327103,"width":33.177570093457945,"height":146},{"selector":"Option","top":272,"left":30.451713395638627,"width":39.096573208722745,"height":71},{"selector":"Option","top":188,"left":30.373831775700932,"width":39.252336448598136,"height":71},{"selector":"Option","top":371,"left":80.86789330218069,"width":11.47293613707165,"height":43},{"selector":"Option","top":308,"left":0,"width":20.5607476635514,"height":123}]}}'>
                            <LayoutItem>
                                <Text semantic="question_title" text={'question title'}></Text>
                            </LayoutItem>

                            <LayoutItem>
                                <TextOption semantic="question_option" onClick={() => this.props.event({type: 'quiz_correct', points: 1})} text="option1"></TextOption>
                            </LayoutItem>
                            <LayoutItem>
                                <TextOption semantic="question_option" onClick={() => this.props.event({type: 'quiz_correct', points: 0})} text="option2"></TextOption>
                            </LayoutItem>
                            <LayoutItem>
                                <Button onClick={() => act({type: 'next'})}></Button>
                            </LayoutItem>

                            <LayoutItem>
                                <ProgressiveImage semantic="question_image" src='https://media.gettyimages.com/photos/spring-field-picture-id539016480?s=612x612'/>
                            </LayoutItem>
                            <LayoutItem>
                                <ProgressiveImage src='http://www.earthtimes.org/newsimage/wwf-50-Years-Conservation_153.jpg'/>
                            </LayoutItem>
                        </LayoutContainer>
                    </Screen> */}
                {/* for many subling screens */}
                {/* {this.props.questions.map( (q, i) =>
                        <Screen screenId={"question"+i} key={i} group="questions" if={(state) => { return !this.props.result && this.state.status === "questions" && this.props.questionHashlist.getId(i) === this.props.questionIds[this.props.currentQuestionIndex]}}> */}
                {/* Мне кажется quizBlock пока не нужен, это предполагает вложенность контейнера в контейнер также... */}
                {/* <QuizBlock
                                options={q.options}
                                key={this.props.questionHashlist.getId(i)}
                                text={q.text}
                                onOptionSelect={this.onOptionSelect}>
                            </QuizBlock> */}
                {/* TODO set layout */}
                {/* TODO LayoutContainer height auto */}
                {/* </Screen>
                    )} */}
                {/* single screen */}
                {/* <Screen screenId="resultId" if={(state) => { return this.props.result }}>
                        <ResultBlock
                            title={this.props.result ? this.props.result.title: null}
                            description={this.props.result ? this.props.result.description: null}
                            onRestart={this.onRestart}>
                        </ResultBlock>
                    </Screen> */}
                {/* </ScreenManager> */}
            </EngageApp>
        )
    }

    render() {
        return <EngageApp loading={this.props.loading}></EngageApp>
    }
}

const mapStateToProps = state => {
    return {
        // currentQuestionIndex: state.session.currentQuestionIndex,
        // questionIds: state.session.questionIds,
        // width: state.app.size.width,
        // height: state.app.size.height,
        loading: state.app.loading,
        // questionHashlist: state.quiz.questions,
        // questions: state.quiz.questions.toArray(),
        // resultHashlist: state.quiz.results,
        // results: state.quiz.results.toArray(),
        // result: state.session.result ? state.quiz.results[state.session.result]: null,
        // startBackgroundColor: state.style.startBackgroundColor
    }
}

const mapActionToProps = {
    init,
    answer,
    event,
}

export default connect(mapStateToProps, mapActionToProps)(App)
