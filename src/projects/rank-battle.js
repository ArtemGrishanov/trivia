import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from '../App'

import store from '../store'

import Remix from '../lib/remix'

import initRemixRouting from '../lib/plugins/remix-routing'
import initShare from '../lib/plugins/share'
import initGoogleAnalytics from '../lib/plugins/googleAnalytics'
import initFacebookAnalytics from '../lib/plugins/facebook-pixel'
import initQuizAnalytics from '../lib/plugins/quiz-analytics'
import initButtonBehavior from '../lib/plugins/button-behavior'

import { getTranslation } from '../lib/engage-ui/translations'

import './index.css'

Remix.setStore(store)

Remix.extendSchema({
    ['router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ displayName=RankBattlePlayground].numberOfVotes./^[0-9a-z]+$/']: {
        type: 'number',
        min: 0,
        max: 2 ** 64,
        default: 0,
    },
})

initButtonBehavior({ remix: Remix })

initRemixRouting({
    remix: Remix,
    resultScreenTag: 'result',
    userFormScreenTag: 'user_form_screen_tag',
    // some params specially for Remix-Routing plugin
    screenRoute: [
        { tag: 'screen' }, // show all scrrens with tag in linear order
        { tag: 'question', shuffle: true }, // show all scrrens with tag and shuffle them
        { idByFunction: 'calcTriviaRes' }, // show one screenId returned by function 'calcTriviaRes'
    ],
    restartTag: 'restart',
    nextTag: 'option',
})

function getScreenHTMLPreview({ screen, defaultTitle }) {
    const FB_SHARE_WIDTH = 1200, // поддерживаем пока один фикс размер шаринг картинки
        FB_SHARE_HEIGHT = 630,
        playground = screen.components.toArray().find(c => c.displayName === 'RankBattlePlayground'),
        backStyle = `position: absolute;
            width:${FB_SHARE_WIDTH}px;
            height:${FB_SHARE_HEIGHT}px;
            background-color: #DDE1E8;
            `

    if (!playground) {
        return `<div style="${backStyle}">
                ${defaultTitle}
            </div>`
    }

    const like = `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAYAAAA4E5OyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAWwSURBVHgB1ZyLdeo4EIYnqYCtIO7gpgR3sOng0kHoAN8KQgfQAdkKzFZAbgVmKyAd/KuJR0EWwpH1sHK/cwYfsPUazeiN72gGACzU5VHkh5JKZCFichJ5V/JbyUHJ293d3Tv9ybASlKyUtErOiOeo5EXJI2XkjhKjMvykLs9KasdtruWDXP+j3hJs2GIqJQ9ydSmAw/3iuJTluOIoj1LE2mEJ/H2vZKmkogDE0p6U7JR0Vvz8fRsadxZUZmpHRltRwoISI+ntHIpZU0m4VqTgtiJqmgFJ36WYiuZGTPhcQhGOvLgUM5+1oG8rNKyUFX0DHK67z2ot6Bu3rZHgEd+pMaPPPO6yu5AkdDQS4kSTN5ipUHlrsinFoYyG/gDQ93Ln5Eqx3KSZGPZJaquiAqh0H5MqxWpAm4lhVxiyLeFmUimalkIRk9NsaCK47gohrldCKWblvNBU0PftnTY1CsBhIfG1FAFXqpGHekpYs904I24OcmuW29DMYNg5dN6WarlK1KDLqhWbakI8XJi1FEgvA0x2PfSNrMbPdRDpKlZc9YhCvFwHfaPYOcIfKQAMxyjVVw8vvR/2z0CHACsRZbYY54kmgqErt76Z31Ii4O5tNBtyZ/gFfjQUAHysBBmsQ+JdjRSIa2phPLvGtOXGJQWAoZVsbj3UygNJu0VL0S7YNbix6zCNDhEVh4uVDCpF36xite6R8C1ahC9CbxE3LHCXGZdaPFNiMN71piCot5G8tRLHp1fcy/WnXP+l9PygvLC71RTGP0YcH26jFVLL9ZXSU1N+agpDl1dvpNG9pd0DJQTzrbOeKADZ0znJ114hdNkIes+w6fOT8nOiuIrUzUTNH6ZC3ig9NeWHzX2N8GUFXe6Pto4V8iA//KaESFdWUX5YEUsloeMnvYle8cc9XTKdend97p007ikmz23I8AwV/oEVok3tRImY0TpsapqOaQh/mQqZBPqRHg+7K8ftUvussVa+uKcAlBL4uAOvl7Dfdur7T+MeLypVVIYdRTJJIWIRrASeIZqWtTFa+ROVY43ImTorZIqZcRddO35nZXwsN6qxDI/+DlSGpZI9xYDLtHvluKfXMlfGb8eRiVYlz4wtHc5BTZ5YeX0wC7ixHuQZcCf3Plff4blOivyz3DEa8gTGRpb+YSffX40Ct45EtkYk7UhmasO6Uhy2C8F7PILLit7Z/qHDcB/XRS1heEHpVmE7I7GvFodyMGm3AJcyt1cm44HpEruR51aGlXSYDz4kM2lcBbvJwHApzYc1bu+VaD7XKTFPA9siYKkBw7I/ubSUkhcj/hZ5iDrSheEC+MK8kcvXHyX+R6SH8xx1kgB2+2HcCDVrDje275KjG26RYN8IY6vu8sBUtzkaYcca2NrIQEw33CLhkiS+2phDmNvUEna0G8algV1hGhznFhnWZnHpFF5vPRBSg0dPhTbGc0erwB362t9L4Tkerr2KMoGhddRjD4ZYic+Yw+yG2ZpqFDzWCd8jHwizErOwY4O8ZCcKYsDQOr4e4iPMSnzHHDUVBMOzc/4VhLDhdiVhx7rwolaC4VytmhIwZFziM+bYUCFU2s9GPhqaCuK6YVdb1KHsieariguJqMU0XFP/MxIMsyPKYLYbcZWCsOl7Y4TfoGz3aioj+MztWKQ+nEsqYSTfIbt63pGPKWNJhcH1mbUlpeYLpRRtJ6x8PuPSoJ+TWoYjMVaKPSv+Fn81Q9/e7Y18dcj8L3AzcbtLXpdUimUVTDt7fjDct9E1sqQZwfWWSdl/iYoL2aNSVsxLrhrC8CULKGoVt4D7z8Q6k9FrG6IEjmeL6xEwp1FTIpK+HUIK3ij5m9zvBXmj/ugWX99p/O0QLHzuS793xOag5JfaXD/Qd8eo0T3S0qJ3l2zde/L3h7gQk2bRb5fx6Q5PIvotM4c53jIzi0JciHvZr9x511LqFTv/A/vVwB2+0ZLDAAAAAElFTkSuQmCC')`

    const styles = {
        ['rank-battle-playground']: `
        display: flex;
        width: calc(100% - 48px);
        height: calc(100% - 56px);
        margin: 28px 24px`,

        ['rank-battle-playground_2']: ``,

        ['rank-battle-card']: `
        cursor: pointer;
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        position: relative;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.14);
        justify-content: flex-end;
        align-items: center;`,

        ['rank-battle-card_2']: `
        width: calc(50% - 6px);
        height: 100%;`,

        ['rank-battle-card__leader_desktop']: `
        border: 2px solid #ffffff;
        border-radius: 40px;
        position: absolute;
        width: 110px;
        height: 32px;
        top: 12px;
        right: 12px;
        font-family: Ubuntu;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 16px;
    
        color: #ffffff;
    
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;`,

        ['rank-battle-card__img-wrapper']: `
        position: relative;
        flex-grow: 2;
    
        overflow: hidden;
        border-radius: 4px 4px 0px 0px;
        background-color: transparent;`,

        ['rank-battle-card__img-wrapper2']: `
        position: relative;
        height: calc(100% + 400px);
        width: calc(100% + 400px);
        top: -200px;
        left: -200px;
    
        display: flex;
        align-items: center;
        justify-content: center;`,

        ['rank-battle-card__img']: `
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        height: 100%;
        width: 100%;
        border-radius: 4px;`,

        ['rank-battle-card__votes']: `
        position: absolute;
        height: 175px;
        width: 175px;
        background-image: ${like};
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        background-color: ${playground.highlightColor};
        bottom: 24px;
        border-radius: 50%;`,

        ['rank-battle-card__votes-text']: `
        font-family: Ubuntu;
        font-style: normal;
        font-weight: 300;
        font-size: 24px;
        line-height: 24px;`,

        ['rank-battle-card__votes-count']: `
        font-family: Ubuntu;
        font-style: bold;
        font-weight: 500;
        font-size: 24px;
        line-height: 24px;`,
    }

    return `<div style="${backStyle}">
                <div class="rank-battle-playground rank-battle-playground_2" style="${
                    styles['rank-battle-playground']
                }${styles['rank-battle-playground_2']}">
                ${playground.cardIds
                    .slice(0, playground.numberOfCards)
                    .map((id, i) => {
                        return `
                            <div class="rank-battle-card rank-battle-card_2" style="${styles['rank-battle-card']}${
                            styles['rank-battle-card_2']
                        }${i < playground.numberOfCards - 1 ? 'margin-right: 12px;' : ''}">
                                <div class="rank-battle-card__img" style="${
                                    styles['rank-battle-card__img']
                                }background-image: url(&quot;${playground.imageLinks[id]}&quot;);"></div>
                                <div class="rank-battle-card__votes" style="${
                                    styles['rank-battle-card__votes']
                                }color: #FFFFFF;"></div>
                            </div>`
                    })
                    .join('')}
                </div>
            </div>`
}

initShare({
    remix: Remix,
    /**
     * Функция для генерации главного превью приложения в виде HTML
     * Отсылается вовне, в редактор, где на основе этого html кода будет создано графическое превью
     * Css стили - это те же самые стили, что и для типа проекта загруженный через админку файл
     */
    getMainPreviewHTML: remix => {
        const state = remix.getState(),
            screen = state.router.screens.getByIndex(0) // это может быть кавер скрин или первый вопрос
        return getScreenHTMLPreview({ screen, defaultTitle: 'Rank Battle' })
    },
    /**
     * Функция для генерации превью для каждого отдельного результата шаринга
     */
    getShareEntityPreviewHTML: (remix, shareEntity) => {
        const screenId = shareEntity.screen.id,
            state = remix.getState(),
            resultScreen = state.router.screens[screenId]
        return getScreenHTMLPreview({ screen: resultScreen, defaultTitle: 'Result title' })
    },
})

initGoogleAnalytics({ remix: Remix })

initFacebookAnalytics({ remix: Remix })

initQuizAnalytics({ remix: Remix })

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('remix-app-root'),
)
