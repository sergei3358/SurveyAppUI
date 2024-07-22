'use client';
import React, { useEffect, useState } from 'react';
import { getSurveyById, getQuestionSetWithQuestionBySurveyId } from "../../api/surveyService";
import { useRouter } from 'next/navigation';
import { Form, Button, Radio, Checkbox, Select, Input, Image } from 'antd';
import "../../bootstrap.min.css";
import './surveyStyle.css';

const { Option } = Select;

interface SurveyInfo {
    survey_name: string;
    survey_image_url: string | null;
    survey_image_width: number | 0;
    survey_image_height: number | 0;
    survey_logo_position: string | null;
}

interface Question {
    question_id: string;
    question_text: string;
    question_type: string;
    options?: { option_id: string, option_text: string }[];
}

export default function Page({ params }: any) {
    const router = useRouter();
    const [surveyInfo, setSurveyInfo] = useState<SurveyInfo | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const surveyInfo = await getSurveyById(params.id);
            const questionSetWithQuestions = await getQuestionSetWithQuestionBySurveyId(params.id);

            const questionList: Question[] = Object.values(questionSetWithQuestions).map((questionSet: any) => {

                const firstQuestion = questionSet[0];
                return {
                    question_id: firstQuestion.question_id,
                    question_text: firstQuestion.question_text,
                    question_type: firstQuestion.question_type,
                    options: firstQuestion.option_id? questionSet.map((optionItem: any) => ({ option_id: optionItem.option_id, option_text: optionItem.option_text })) : undefined
                };
            });

            setSurveyInfo(surveyInfo);
            setQuestions(questionList);
        } catch (error) {
            console.error('Error fetching survey data:', error);
            router.push('/not-found');
        }
    };

    const onFinish = (values: any) => {
        const answers = Object.keys(values).map((key) => ({
            question_id: key,
            answer: values[key],
        }));
        console.log('Received values of form:', answers);
    };

    return (
        <div className="container border p-5">
            {surveyInfo && (
                <div>
                    <div className="survey-header">
                    <h1 style={{ textAlign: 'center' }}>{surveyInfo.survey_name}</h1>
                        {surveyInfo.survey_image_url && (
                            <div className={`image-container ${surveyInfo.survey_logo_position === 'left'? 'image-left' : 'image-right'}`}>
                                <Image src={surveyInfo.survey_image_url} alt="Survey" width={surveyInfo.survey_image_width} height={surveyInfo.survey_image_height} />
                            </div>
                        )}
                    </div>
                    <Form name="surveyForm" form={form} onFinish={onFinish} layout="vertical">
                        {questions.map((question: any, index: number) => (
                            <Form.Item key={question.question_id} label={<strong>{index + 1}. {question.question_text}</strong>} name={question.question_id} rules={[{ required: true, message: 'Please answer this question' }]}>
                                {question.question_type === 'Radio Button' && (
                                    <Radio.Group>
                                        {question.options && question.options.map((option: any) => (
                                            <Radio key={option.option_id} value={option.option_text}>{option.option_text}</Radio>
                                        ))}
                                    </Radio.Group>
                                )}
                                {question.question_type === 'Multiple Choice' && (
                                    <Checkbox.Group>
                                        {question.options && question.options.map((option: any) => (
                                            <Checkbox key={option.option_id} value={option.option_text}>{option.option_text}</Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                )}
                                {question.question_type === 'List Box' && (
                                    <Select>
                                        {question.options && question.options.map((option: any) => (
                                            <Option key={option.option_id} value={option.option_text}>{option.option_text}</Option>
                                        ))}
                                    </Select>
                                )}
                                {question.question_type === 'Free Text' && (
                                    <Input.TextArea rows={4} />
                                )}
                            </Form.Item>
                        ))}
                        <Form.Item style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit" className="btn btn-primary">Gönder</Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </div>
    );
}