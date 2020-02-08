import React from 'react'
import '../style/rmx-progressive_image.css'

const STATE_INITIAL = 'STATE_INITIAL';
const STATE_LOADING = 'STATE_LOADING';
const STATE_REVEALING = 'STATE_REVEALING';
const STATE_SHOW = 'STATE_SHOW';
const REVEAL_ANIM_TIME = 1000; // slightly larger then 1s transition in tstx_progressive_image.css

//TODO mouse move, touch makes a parallax effect
//TODO try gifs? Or dedicated component?

class BasicImage extends React.Component {

    static getDerivedStateFromProps(props, state) {
        const pb = !!props.blur;
        let imgst = {};
        if (props.src !== state.src) {
            imgst = {
                src: props.src,
                step: props.srcThumb ? STATE_LOADING: STATE_INITIAL,
                image: null
            }
        }
        return {
            ...state,
            ...imgst,
            src: props.src,
            propsBlur: pb,
            blur: (state.propsBlur !== pb) ? pb: state.blur
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            step: props.srcThumb ? STATE_LOADING: STATE_INITIAL,
            src: null,
            imageMods: "",
            thumbImageMods: "",
            propsBlur: false,
            blur: false,
            image: null
        };
        this.thumbRatio = undefined;
        this.thumbImage = null;
        this.onClick = this.onClick.bind(this);
    }

    componentDidUpdate() {
        this.startLoading();
    }

    componentDidMount() {
        this.startLoading();
    }

    startLoading() {
        if (!this.isLoaded()) {
            this.loadThumbImage()
                .then( () => this.loadFullImage() )
                .then( ()=> {
                    setTimeout( ()=> this.setState({
                        imageMods: 'reveal',
                        thumbImageMods: 'hide'
                    }), 0);
                    setTimeout( ()=> this.setState({
                        step: STATE_SHOW
                    }), REVEAL_ANIM_TIME);
                });
        }
    }

    loadThumbImage() {
        return new Promise( (resolve)=> {
            if (this.props.srcThumb) {
                this.thumbImage = new Image();
                this.thumbImage.src = this.props.srcThumb;
                if (this.thumbImage.complete) {
                    resolve();
                }
                else {
                    this.thumbImage.onload = ()=> {
                        resolve();
                    }
                }
            }
            else {
                resolve();
            }
        })
    }

    /**
     * Load and replace with full image
     *
     * By https://www.sitepoint.com/how-to-build-your-own-progressive-image-loader/
     */
    loadFullImage() {
        return new Promise( (resolve)=> {
            if (this.props.src) {
                const image = new Image();
                image.src = this.props.src;
                if (image.complete) {
                    this.setState({
                        image,
                        imageRatio: image.naturalWidth / image.naturalHeight,
                        step: STATE_REVEALING
                    });
                    resolve();
                }
                else {
                    image.onload = ()=> {
                        this.setState({
                            image,
                            imageRatio: image.naturalWidth / image.naturalHeight,
                            step: STATE_REVEALING
                        });
                        resolve();
                    }
                }
            }
            else {
                resolve();
            }
        })
    }

    isProgressive() {
        return this.props.srcThumb || this.props.src;
    }

    isLoaded() {
        return !!(this.state.image && this.state.image.naturalWidth > 0);
    }

    isThumbLoaded() {
        return !!(this.thumbImage && this.thumbImage.naturalWidth > 0);
    }

    onClick() {
        if (this.props.blur) {
            this.setState({
                blur: !this.state.blur
            });
        }
    }

    render() {
        const showThumb = this.isThumbLoaded() && (this.state.step === STATE_LOADING || this.state.step === STATE_REVEALING);
        const showOriginal = this.isLoaded() && (this.state.step === STATE_REVEALING || this.state.step === STATE_SHOW);
        const originImgStyle = {};
        if (this.props.backgroundSize === 'cover') {
            // originImgStyle['marginLeft'] = '-100%';
            // originImgStyle['marginRight'] = '-100%';
            // console.log(`Progr Img render w=${this.props.width} h=${this.props.height}`)
            if (this.state.imageRatio > this.props.width / this.props.height) {
                originImgStyle['maxWidth'] = 'none';
                originImgStyle['height'] = '100%';
            }
            else {
                originImgStyle['maxHeight'] = 'none';
                originImgStyle['width'] = '100%';
            }
        }
        else if (this.props.backgroundSize === 'contain') {

        }
        const alignCntSt = {
            lineHeight: (this.state.height-3)+"px" //TODO -3 determine this later
        };
        let cntCl = "";
        if (this.props.border && (showThumb || showOriginal)) {
            cntCl += " __border"
        }
        let mainImgCl = this.state.imageMods;
        if (this.state.blur) {
            mainImgCl += " __blur";
        }
        if (this.props.animation) {
            mainImgCl += " __"+this.props.animation;
        }
        let thumbImgCl = this.state.thumbImageMods;
        return (
            <div className={`image_cnt ${cntCl}`} /*style={cntSt}*/ onClick={this.onClick}>
                {showThumb &&
                    <div className="image_align_cnt" style={alignCntSt}>
                        <img alt="" className={"preview " + thumbImgCl} src={this.props.srcThumb}/>
                    </div>
                }
                {showOriginal && this.state.height === undefined &&
                    // automatic height
                    <img alt="" style={{visibility:"hidden"}} className={"original " + mainImgCl} src={this.props.src}/>
                }
                {showOriginal &&
                    <div className="image_align_cnt" style={alignCntSt}>
                        <img alt="" className={"original " + mainImgCl} src={this.props.src} style={originImgStyle}/>
                        {this.state.blur &&
                            <div className="cursor_wr">
                                <svg id="pb-cp-icon-hand-press-lg" viewBox="0 0 94.2691 104.3058" width="100%" height="100%">
                                    <path fillRule="evenodd" clipRule="evenodd" fill="#FFFFFF" d="M27.7876,72.8258C15.1172,67.6919,6.1761,55.276,6.1761,40.7637
                                    c0-19.1026,15.4857-34.5882,34.5882-34.5882s34.5882,15.4856,34.5882,34.5882c0,1.0043-0.0519,1.9975-0.1359,2.9795
                                    c-0.5868,0.0828-1.1674,0.2075-1.7282,0.4138l-0.3434,0.1272c-0.5176,0.1915-1.0092,0.4299-1.47,0.7103
                                    c-0.0939-0.0939-0.1952-0.1766-0.2915-0.2656c0.168-1.2995,0.2631-2.6213,0.2631-3.9653c0-17.0285-13.8538-30.8824-30.8824-30.8824
                                    S9.882,23.7352,9.882,40.7637c0,12.5308,7.5056,23.3335,18.2527,28.1709c-0.2471,0.5979-0.4361,1.2217-0.4978,1.8838
                                    C27.5726,71.504,27.6455,72.1735,27.7876,72.8258z M40.7643,18.5284c-12.2801,0-22.2353,9.9552-22.2353,22.2353
                                    c0,12.2591,9.9207,22.197,22.1723,22.2316l-1.4169-3.7763c-9.5266-0.7585-17.0495-8.7372-17.0495-18.4553
                                    c0-10.2171,8.3123-18.5294,18.5294-18.5294s18.5294,8.3123,18.5294,18.5294c0,1.8258-0.2755,3.5873-0.7696,5.2562
                                    c0.0581,0.0124,0.1198,0.0173,0.1791,0.0309c0.9536-1.3069,2.2717-2.3075,3.8294-2.8819l0.3385-0.1248
                                    c0.0049-0.0025,0.0087-0.0025,0.0136-0.0037c0.0753-0.7486,0.1149-1.5083,0.1149-2.2766
                                    C62.9996,28.4837,53.0456,18.5284,40.7643,18.5284z M86.5814,66.0551c4.6077,12.2875-1.7368,25.9708-14.1738,30.5636
                                    c-9.3116,3.4391-19.3978,0.8066-25.8127-5.8924l-0.0037-0.0037c-0.7029-0.735-1.3564-1.5231-1.9654-2.352L31.9715,73.2359
                                    c-1.0105-1.2069-0.8363-2.9993,0.3879-4.0036c3.5836-2.9338,8.8867-2.4459,11.8428,1.0908l5.8121,6.951L37.0239,42.6377
                                    c-0.882-2.3495,0.3323-4.9671,2.7102-5.8442l0.3409-0.126c2.3779-0.8783,5.0215,0.3138,5.9022,2.6633l6.1752,16.4652
                                    c-0.8808-2.3483,0.3323-4.9659,2.7115-5.8442l0.3397-0.126c2.3779-0.8783,5.0215,0.315,5.9022,2.6645
                                    c-0.8808-2.3495,0.3323-4.9671,2.7102-5.8454l0.3409-0.126c2.3779-0.8783,5.0215,0.315,5.9022,2.6645l1.659,4.4224
                                    c-0.882-2.3495,0.3323-4.9671,2.7102-5.8454l0.3409-0.1248c2.3779-0.8795,5.0202,0.3138,5.9022,2.6633L86.5814,66.0551z"></path>
                                </svg>
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }
}

export default BasicImage