module.exports = {
    theme: {
        transitionProperty: {
            'none': 'none',
            'all': 'all',
            'color': 'color',
            'bg': 'background-color',
            'border': 'border-color',
            'colors': ['color', 'background-color', 'border-color'],
            'opacity': 'opacity',
            'transform': 'transform'
        },
        transitionDuration: {
            'default': '250ms',
            '0': '0ms',
            '100': '100ms',
            '250': '250ms',
            '500': '500ms',
            '750': '750ms',
            '1000': '1000ms'
        },
        transitionTimingFunction: {
            'default': 'ease',
            'linear': 'linear',
            'ease': 'ease',
            'ease-in': 'ease-in',
            'ease-out': 'ease-out',
            'ease-in-out': 'ease-in-out'
        },
        transitionDelay: {
            'default': '0ms',
            '0': '0ms',
            '100': '100ms',
            '250': '250ms',
            '500': '500ms',
            '750': '750ms',
            '1000': '1000ms'
        },
        willChange: {
            'auto': 'auto',
            'scroll': 'scroll-position',
            'contents': 'contents',
            'opacity': 'opacity',
            'transform': 'transform'
        }
    },
    variants: {
        transitionProperty: ['responsive'],
        transitionDuration: ['responsive'],
        transitionTimingFunction: ['responsive'],
        transitionDelay: ['responsive'],
        willChange: ['responsive'],
    },
    plugins: [
        require('tailwindcss-transitions')(),
    ]
}