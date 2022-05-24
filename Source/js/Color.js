


(async () => {

    const buffer = {};

    function stringHue(string = ''){

        const chars = [...btoa(string)];
        let hue = 0;

        for(const c of chars)
            hue += c.charCodeAt(0);

        return hue % 255;
    }

    function stringColor(string = '',saturation = 50,lightness = 50){
        return `hsl(${ stringHue(string) },${ saturation }%,${ lightness }%)`;
    }


    window.Color = { stringHue , stringColor };

})();


export const orangeA = 'color : #d19e3e';
export const blueA = 'color : #3987ff';
export const reset = 'color : unset';
