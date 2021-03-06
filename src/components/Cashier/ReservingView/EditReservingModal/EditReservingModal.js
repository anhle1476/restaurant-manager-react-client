import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

import {
  Modal,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import CustomInputGroup from "../../../CustomInputGroup/CustomInputGroup";
import ModalHeaderWithCloseBtn from "../../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";

import reservingApi from "../../../../api/reservingApi";
import areaApi from "../../../../api/areaApi";
import { formatDateDayFirst, fromToday } from "../../../../utils/dateUtils";
import { toastError, toastSuccess } from "../../../../utils/toastUtils";

import "react-datepicker/dist/react-datepicker.css";
import "./EditReservingModal.scss";
import TableDisplay from "../../TableDisplay/TableDisplay";

const RESERVING_SCHEMA = {
  reservingTime: undefined,
  customerName: "",
  customerPhoneNumber: "",
  appTables: {},
};
const FEEDBACK_SCHEMA = {
  customerName: "",
  customerPhoneNumber: "",
};

const EditReservingModal = ({
  show,
  toggle,
  tables,
  reserving = RESERVING_SCHEMA,
  date = new Date(),
  currentOrders = [],
  handleAdd,
  handleEdit,
}) => {
  const [data, setData] = useState(RESERVING_SCHEMA);
  const [feedback, setFeedback] = useState(FEEDBACK_SCHEMA);
  const [areas, setAreas] = useState([]);
  const [selectArea, setSelectArea] = useState("");

  useEffect(() => {
    if (!show) return;
    // set default date if need and convert appTables to Object<ID, Table>
    const newData = !reserving?.id
      ? { ...RESERVING_SCHEMA, reservingTime: date }
      : {
          ...reserving,
          reservingTime: new Date(reserving.reservingTime),
          appTables: reserving.appTables.reduce((obj, table) => {
            obj[table.id] = table;
            return obj;
          }, {}),
        };
    setData(newData);
  }, [show, reserving, date]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await areaApi.getAll();
        setAreas(res.data);
      } catch (ex) {
        toastError("L???y th??ng tin th???t b???i, vui l??ng th??? l???i sau");
      }
    };
    fetchAreas();
  }, []);

  // convert current date reserving orders to Object<TableId, OrderId>
  const reservedMap = currentOrders.reduce((obj, order) => {
    const appTables = order.appTables;
    if (appTables?.length && !order.deleted)
      appTables.forEach(({ id }) => (obj[id] = order.id));
    return obj;
  }, {});

  const selectedCount = Object.keys(data.appTables).length;

  const isFuture = fromToday(date) !== 0;

  const doToggle = () => {
    toggle();
    setFeedback(FEEDBACK_SCHEMA);
    setSelectArea("");
  };

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const handleChangeTime = (time) => {
    setData({
      ...data,
      reservingTime: time < new Date() ? new Date() : time,
    });
  };

  const handleSelectTable = (table) => {
    const tableMap = { ...data.appTables };
    if (tableMap[table.id]) {
      delete tableMap[table.id];
    } else {
      tableMap[table.id] = table;
    }
    setData({ ...data, appTables: tableMap });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCount) return;
    try {
      setFeedback(FEEDBACK_SCHEMA);
      //convert data appTables of data to array and submit
      const res = await reservingApi.saveOrUpdate({
        ...data,
        appTables: Object.values(data.appTables),
      });
      if (data.id) {
        handleEdit(res.data);
      } else {
        handleAdd(res.data);
      }
      toastSuccess("L??u ????n ?????t b??n th??nh c??ng");
      toggle();
      setData(RESERVING_SCHEMA);
    } catch (ex) {
      setFeedback(ex.response.data);
      toastError("L??u ????n ?????t b??n th???t b???i");
    }
  };

  return (
    <Modal
      className="modal-lg modal-dialog-scrollable"
      isOpen={show}
      toggle={doToggle}
    >
      <ModalHeaderWithCloseBtn toggle={doToggle}>
        {data.id ? "Ch???nh s???a ????n ?????t b??n" : "Th??m ????n ?????t b??n"} ng??y{" "}
        {formatDateDayFirst(date)}
      </ModalHeaderWithCloseBtn>
      <ModalBody className="bg-white edit-reserving-modal">
        <Form onSubmit={handleSubmit}>
          <CustomInputGroup
            required
            onChange={handleChange}
            label="T??n kh??ch h??ng:"
            name="customerName"
            value={data.customerName}
            feedback={feedback.customerName}
          />
          <CustomInputGroup
            required
            onChange={handleChange}
            label="S??? ??i???n tho???i:"
            name="customerPhoneNumber"
            value={data.customerPhoneNumber}
            feedback={feedback.customerPhoneNumber}
          />
          <FormGroup>
            <Label>Gi??? ?????t:</Label>
            <DatePicker
              className="form-control"
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="HH:mm"
              selected={data.reservingTime}
              onChange={handleChangeTime}
              closeOnScroll={true}
              minTime={setHours(
                setMinutes(date, isFuture ? 0 : date.getMinutes()),
                isFuture ? 0 : date.getHours()
              )}
              maxTime={setHours(setMinutes(date, 59), 23)}
            />
          </FormGroup>

          {show && (
            <div>
              <div className="mb-2">
                <FormGroup>
                  <Label for="area" className="mr-2">
                    Ch???n b??n ?????t: (
                    {selectedCount
                      ? `???? ch???n ${selectedCount} b??n`
                      : "Ch??a ch???n b??n n??o"}
                    )
                  </Label>
                  <Input
                    type="select"
                    name="area"
                    value={selectArea}
                    onChange={(e) => setSelectArea(e.target.value)}
                  >
                    <option value="">T???t c??? khu v???c</option>
                    {areas.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
              <div className="tables-modal-view">
                {tables
                  .filter(
                    (table) =>
                      selectArea === "" || table.area.id === Number(selectArea)
                  )
                  .map((table) => (
                    <TableDisplay
                      key={table.id}
                      table={table}
                      disabled={
                        reservedMap[table.id] !== undefined &&
                        reservedMap[table.id] !== data.id
                      }
                      selected={Boolean(data.appTables[table.id])}
                      onClick={() => handleSelectTable(table)}
                    />
                  ))}
              </div>
            </div>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="light" onClick={doToggle}>
          H???y
        </Button>{" "}
        <Button
          color="warning"
          disabled={!selectedCount}
          onClick={handleSubmit}
        >
          L??u
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditReservingModal;
