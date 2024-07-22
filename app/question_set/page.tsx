'use client';
import { Button, Input, Modal, Select, SelectProps, Table, TableProps } from 'antd';
import { FileAddOutlined, SyncOutlined } from '@ant-design/icons';
import "../bootstrap.min.css";
import React, { Key, useEffect, useState } from 'react';
import { createQuestionSet, getQuestionSets } from '../api/questionSetService';

interface DataType {
     questionSetName: string;
     questionSetID: string;
     questionSetType: string
     key: Key;
}


export default function Home() {

     const questionSet = { "questionSetName": "", "questionSetID": "", "questionSetType": "" };
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [questionSetName, setQuestionSetName] = useState<string>('');
     const [questionSetType, setQuestionSetType] = useState<string>('');
     const [data, setData] = useState<DataType[]>([]);

     const options: SelectProps['options'] = [];
     const list = ['Deneme Tür'];

     list.forEach(element => {
          options.push({
               value: element,
               label: element,
          });
     })

     useEffect(() => {
          fetchQuestionSets();
     }, []);

     const fetchQuestionSets = async () => {
          let questionSetList: DataType[] = [];
          const question_set = await getQuestionSets();
          question_set.forEach((e: any) => {
               let questionSet = {
                    questionSetName: e.question_set_name,
                    questionSetID: e.question_set_id,
                    questionSetType: e.question_set_type,
                    key: e.question_set_id,
               }
               questionSetList.push(questionSet);
          });
          // const parsedData = JSON.parse(question_set);

          // parsedData.forEach((e: any) => {
          //      let questionSet = {
          //           questionSetName: e.questionSet.questionSetName,
          //           questionSetID: e.questionSet.questionSetID,
          //           questionSetType: e.questionSet.questionSetType,
          //           key: e.questionSet.questionSetID,
          //      }
          //      questionSetList.push(questionSet);
          // });
          setData(questionSetList);

     }


     const columns: TableProps<DataType>['columns'] = [

          {
               title: 'Tanıtıcı',
               dataIndex: 'questionSetID',
               width: 100,
               render: (text: string, record: DataType) => (
                    <a href={`question_set/${record.questionSetID}`}>{text}</a>
               ),

          },
          {
               title: 'Tanım',
               dataIndex: 'questionSetName',
               width: 100
          },
          {
               title: 'Soru Seti Türü',
               dataIndex: 'questionSetType',
               width: 100
          }
     ];

     const showModal = () => {
          setIsModalOpen(true);
     };

     const handleCancel = () => {
          setIsModalOpen(false);
     };

     const handleSetNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setQuestionSetName(e.target.value);
          questionSet.questionSetName = e.target.value;
     };

     const handleSetTypeChange = (value: string) => {
          setQuestionSetType(value);

     };

     const handleCancelModal = () => {
          setQuestionSetName('');
          setQuestionSetType('');
          handleCancel();
     };

     const handleOk = async () => {
          questionSet.questionSetID = crypto.randomUUID().toString();
          questionSet.questionSetName = questionSetName;
          questionSet.questionSetType = questionSetType;
          try {
               const response = await createQuestionSet(questionSet);

               if (response) {
                    window.location.href = `question_set/${questionSet.questionSetID}`;
               } else {
                    console.error('Question set oluşturulurken bir hata oluştu.');
               }
          } catch (error) {
               console.error('Question set oluşturulurken bir hata oluştu:', error);
          }
     };



     return (

          <div className='container mt-5 mb-5'>

               <Button
                    onClick={showModal}
                    type="default"
                    style={{
                         float: 'right',
                         marginBottom: 16,
                    }}
                    icon={<FileAddOutlined />}
               >
                    Yeni Soru Seti
               </Button>

               <Button
                    type="default"
                    style={{
                         float: 'right',
                         marginBottom: 16,
                         marginRight: 15
                    }}
                    icon={<SyncOutlined />}
               >
                    Yenile
               </Button>

               <Modal
                    width={300}
                    title="Soru Seti Oluştur"
                    open={isModalOpen}
                    okType='default'
                    onOk={handleOk}
                    onCancel={handleCancelModal}
                    okText='Kaydet ve Aç'
                    cancelText='İptal'
                    afterClose={() => {
                         setQuestionSetName('');
                         setQuestionSetType('');
                    }}>
                    <p className='mt-2'>Soru Seti Türü</p>
                    <Select
                         value={questionSetType}
                         style={{ width: 200 }}
                         options={options}
                         onChange={(value) => handleSetTypeChange(value)}
                    />
                    <p className='mt-2'>Tanımı</p>
                    <Input
                         style={{ width: 200 }}
                         placeholder=""
                         value={questionSetName}
                         onChange={handleSetNameChange}
                    />
               </Modal>
               <Table key="key" columns={columns} dataSource={data} />
          </div>
     );
}



