'use client';
import { Button, Input, Modal, Table, TableProps } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import "../bootstrap.min.css";
import React, { useEffect, useState } from 'react';
import { createSurvey, getSurveys } from '../api/surveyService';
import { Helmet } from 'react-helmet';

interface Survey {
    surveyID: string;
    surveyName: string;
    surveyValidityStart: string;
    surveyValidityEnd: string;
    key: string
}

const columns: TableProps<Survey>['columns'] = [
    {
        title: 'Tanıtıcı',
        dataIndex: 'surveyID',
        width: "25%",
        render: (text: string, record: Survey) => (
            <a href={`surveys/${record.surveyID}`}>{text}</a>
        ),
    },
    {
        title: 'Anket Adı',
        dataIndex: 'surveyName',
        width: "25%"
    },
    {
        title: 'Başlangıç Tarihi',
        dataIndex: 'surveyValidityStart',
        width: "25%",
        render: (text: string) => {
            const startDate = new Date(text);
            if (isNaN(startDate.getTime())) {
                return 'Geçersiz Tarih';
            }
            return startDate.toLocaleDateString('tr-TR'); // Türkçe tarih biçimi için 'tr-TR'
        }
    },
    {
        title: 'Bitiş Tarihi',
        dataIndex: 'surveyValidityEnd',
        width: "25%",
        render: (text: string) => {
            const endDate = new Date(text);
            if (isNaN(endDate.getTime())) {
                return 'Geçersiz Tarih';
            }
            return endDate.toLocaleDateString('tr-TR');
        }
    }
];

export default function Surveys() {

    const newSurvey = { "surveyID": "", "surveyName": "", "surveyValidityStart": "", "surveyValidityEnd": "" };
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [data, setData] = useState<Survey[]>([]);



    useEffect(() => {
        fetchSurveys();
    }, []);


    const fetchSurveys = async () => {
        let surveyList: Survey[] = [];
        const surveys = await getSurveys();
        
        if (surveys) {
            surveys.forEach((e: any) => {
                let survey = {
                    surveyID: e.survey_id,
                    surveyName: e.survey_name,
                    surveyValidityStart: e.survey_validity_start,
                    surveyValidityEnd: e.survey_validity_end,
                    key: e.survey_id
                }
                surveyList.push(survey);
            });
            setData(surveyList);
        }

    }

    // NEW SURVEY
    const [surveyName, setSurveyName] = useState<string>('');
    const [selectedStartDate, setselectedStartDate] = useState('');
    const [selectedEndDate, setselectedEndDate] = useState('');

    const handleSurveyNameChange = (event: any) => {
        setSurveyName(event.target.value);

    };
    const handleStartDateChange = (event: any) => {
        setselectedStartDate(event.target.value);
    };
    const handleEndDateChange = (event: any) => {
        setselectedEndDate(event.target.value);
    };

    // NEW SURVEY POPUP
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleCancelModal = () => {
        setSurveyName('');
        setselectedStartDate('');
        setselectedEndDate('');
        handleCancel();
    };
    const handleOk = async () => {

        newSurvey.surveyID = crypto.randomUUID().toString();
        newSurvey.surveyName = surveyName;
        newSurvey.surveyValidityStart = selectedStartDate;
        newSurvey.surveyValidityEnd = selectedEndDate;

        try {
            const response = await createSurvey(newSurvey);

            if (response) {
                window.location.href = `surveys/${newSurvey.surveyID}`;
            } else {
                console.error('Survey oluşturulurken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Survey oluşturulurken bir hata oluştu:', error);
        }
    };



    return (

        <div className='container mt-5 mb-5'>

            <Helmet>
                <title>Surveys</title>
            </Helmet>
            <Button
                onClick={showModal}
                type="default"
                style={{ color: "#0d6efd", fontSize: 15, border: "none", float: "right", marginBottom: 20 }}
                icon={<FileAddOutlined />}
            >
                Yeni Anket Oluştur
            </Button>
            <Modal
                width={300}
                title="Anket Oluştur"
                open={isModalOpen}
                okType='default'
                onOk={handleOk}
                onCancel={handleCancelModal}
                okText='Kaydet ve Aç'
                cancelText='İptal'
                afterClose={() => {
                    setSurveyName('');
                    setselectedStartDate('');
                    setselectedEndDate('');
                }}>
                <p style={{ fontSize: 15, fontWeight: "bolder" }} className='mt-2'>Anket Adı</p>
                <Input
                    style={{ width: 200 }}
                    placeholder=""
                    value={surveyName}
                    onChange={handleSurveyNameChange}
                />
                <p style={{ fontSize: 15, fontWeight: "bolder" }} className='mt-2'>Anket Başlangıç Tarihi</p>
                <Input
                    style={{ width: 200 }}
                    type="date"
                    id="dateInput"
                    name="dateInput"
                    value={selectedStartDate}
                    onChange={handleStartDateChange}
                />
                <p style={{ fontSize: 15, fontWeight: "bolder" }} className='mt-2'>Anket Bitiş Tarihi</p>
                <Input
                    style={{ width: 200 }}
                    type="date"
                    id="dateInput"
                    name="dateInput"
                    value={selectedEndDate}
                    onChange={handleEndDateChange}
                />
            </Modal>
            <Table key="key" columns={columns} dataSource={data} />
        </div>
    );
}



