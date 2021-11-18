import { LightningElement } from 'lwc';

export default class TreeProducts extends LightningElement {
    items = [
        {
            label: 'Western Sales Director',
            name: '1',
            expanded: false,
            items: [
                {
                    label: 'Western Sales Manager',
                    name: '2',
                    expanded: false,
                    items: [
                        {
                            label: 'CA Sales Rep',
                            name: '3',
                            expanded: false,
                            items: [],
                        },
                        {
                            label: 'OR Sales Rep',
                            name: '4',
                            expanded: false,
                            items: [],
                        },
                    ],
                },
            ],
        },
        {
            label: 'Eastern Sales Director',
            name: '5',
            expanded: false,
            items: [
                {
                    label: 'Easter Sales Manager',
                    name: '6',
                    expanded: false,
                    items: [
                        {
                            label: 'NY Sales Rep',
                            name: '7',
                            expanded: false,
                            items: [],
                        },
                        {
                            label: 'MA Sales Rep',
                            name: '8',
                            expanded: false,
                            items: [],
                        },
                    ],
                },
            ],
        },
        {
            label: 'International Sales Director',
            name: '9',
            expanded: false,
            items: [
                {
                    label: 'Asia Sales Manager',
                    name: '10',
                    expanded: false,
                    items: [
                        {
                            label: 'Sales Rep1',
                            name: '11',
                            expanded: false,
                            items: [],
                        },
                        {
                            label: 'Sales Rep2',
                            name: '12',
                            expanded: false,
                            items: [],
                        },
                    ],
                },
                {
                    label: 'Europe Sales Manager',
                    name: '13',
                    expanded: false,
                    items: [
                        {
                            label: 'Sales Rep1',
                            name: '14',
                            expanded: false,
                            items: [],
                        },
                        {
                            label: 'Sales Rep2',
                            name: '15',
                            expanded: false,
                            items: [],
                        },
                    ],
                },
            ],
        },
    ];
}