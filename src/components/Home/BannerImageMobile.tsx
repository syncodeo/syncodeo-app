import React from 'react';

interface IProps {

}

interface IState {

}

export default class BannerImageMobile extends React.Component<IProps, IState>{

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
        let space = document.getElementById('space');

        let starsCount = [15, 20, 30];
        let starsColor = ['#6B75B5', '#929DCA', '#DCE4ED'];
        let starsAnimationDuration = [4, 8, 12];
        let starsSize = ['10px', '7px', '5px'];
        // Ajout des étoiles
        for (let depth = 2; depth >= 0; depth--) {
            // Création des étoiles
            for (let starIndex = 0; starIndex < starsCount[depth]; starIndex++) {
                // Calcul du décalage
                let left = (200 / starsCount[depth]) * starIndex;
                left -= (Math.random() - .5) * 5;
                left = Math.round(left * 100) / 100;
                this.instantiateStar(depth, left + '%', starsSize, starsColor, starsAnimationDuration, space);
            }
        }
    }

    render() {
        return (
            <div id="space"></div>
        )
    }
}