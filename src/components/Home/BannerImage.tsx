import React from 'react';
import './BannerImage.less';

interface IProps {
    isMobile: boolean;
}

interface IState {

}

export default class BannerImage extends React.Component<IProps, IState>{
    instantiateStar(depth, left, starsSize, starsColor, starsAnimationDuration, space) {
        let star = document.createElement('div');
        star.classList.add('stars');
        star.style.left = left;
        star.style.width = starsSize[depth];
        star.style.height = starsSize[depth];
        star.style.borderRadius = '50%';
        star.style.backgroundColor = starsColor[depth];
        star.style.animationDelay = '-' + (((Math.random() * starsAnimationDuration[depth]) * 10) / 10) + 's';
        star.style.animationDuration = starsAnimationDuration[depth] + 's';
        star.style.zIndex = (depth !== 0) ? -(depth + 1) : depth;
        space.appendChild(star);
    }

    componentDidMount() {
        let logo = document.getElementById('logo');
        let logoX = 0;
        let logoY = 0;

        document.onmousemove = function (e) {
            let mouseX = e.clientX;
            let mouseY = e.clientY;

            let coefX = mouseX / window.innerWidth;
            let coefY = mouseY / window.innerHeight;

            let offsetX = (coefX - 0.5) * 125;
            let offsetY = (coefY - 0.5) * 100;

            offsetX = Math.round(offsetX * 100) / 100;
            offsetY = Math.round(offsetY * 100) / 100;

            logoX += (offsetX - logoX) / 5;
            logoY += (offsetY - logoY) / 5;

            logo.style.transform = `translate(${logoX}px, ${logoY}px)`;
        }
    }

    render() {
        return (
            <div id="banner-image">
                <div id="space">
                    <img className="noselect" src={require('../../img/logo/menu/logo.png')} alt="logo" id="logo" />}
                </div>
                {/* <video autoPlay loop muted>
                    <source src={require('../../videos/BackgroundHomeSyncodeo.mp4')} type="video/mp4" />
                    <source src={require('../../videos/BackgroundHomeSyncodeo.webm')} type="video/webm" />
                </video> */}
            </div>
        )
    }
}