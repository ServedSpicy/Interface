


(async () => {

    function stringHue(string = ''){

        const chars = [...checksum(string)];
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
