import React, {useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import EditableSpan from './EditableSpan';

export default {
    title: 'TODOLIST/EditableSpan',
    component: EditableSpan,
} as ComponentMeta<typeof EditableSpan>;

const Template: ComponentStory<typeof EditableSpan> = () => {

    const [text, setText] = useState("1")
    const changeText = (text: string) => setText(text)

    return <EditableSpan
        text={text}
        changeText={changeText}
    />
}


export const EditableSpanStory = Template.bind({});
EditableSpanStory.args = {}
