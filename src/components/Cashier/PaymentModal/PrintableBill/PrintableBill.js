import React from "react";

import { Table } from "reactstrap";

import { formatMoney } from "../../../../utils/moneyUtils";
import {
  formatFullDateTime,
  formatCurrentFullDateTime,
} from "../../../../utils/dateUtils";

import "./PrintableBill.scss";

class PrintableBill extends React.Component {
  render() {
    const {
      id,
      startTime,
      appTable,
      billDetails,
      surcharge,
      discount,
      discountDescription,
      rawCost,
      totalCost,
    } = this.props;

    if (!id) return <div>Chưa có thông tin</div>;

    return (
      <div className="printing-bill">
        <div className="printing-bill-header">
          <h5 className="text-center">Nhà hàng Super Pig</h5>
          <p className="text-center">
            28 Nguyễn Tri Phương, phường Phú Nhuận, TP Huế
          </p>
          <h3 className="text-center">HÓA ĐƠN TẠM TÍNH</h3>
          <div className="printing-bill-meta">
            <div className="printing-bill-meta-group">
              <span>Giờ vào:</span>
              <span>{formatFullDateTime(startTime)}</span>
            </div>
            <div className="printing-bill-meta-group">
              <span>Giờ xuất hóa đơn:</span>
              <span>{formatCurrentFullDateTime()}</span>
            </div>
            <div className="printing-bill-meta-group">
              <span>Bàn:</span>
              <span>
                {appTable.name} ({appTable.area.name})
              </span>
            </div>
            <div className="printing-bill-meta-group">
              <span>Mã hóa đơn:</span>
              <span>{id}</span>
            </div>
          </div>
        </div>
        <div className="printing-bill-body">
          <Table>
            <thead>
              <tr>
                <th>Món</th>
                <th>SL</th>
                <th>Đơn giá</th>
                <th>Tổng (₫)</th>
              </tr>
            </thead>
            <tbody>
              {billDetails.map((details, i) => (
                <tr key={i}>
                  <td>
                    {details.food.name} ({details.food.unit})
                  </td>
                  <td>{details.quantity}</td>
                  <td>{formatMoney(details.food.price)}</td>
                  <td>{formatMoney(details.quantity * details.food.price)}</td>
                </tr>
              ))}
              <tr className="printing-bill-raw-cost">
                <td colSpan="2">Tổng cộng:</td>
                <td colSpan="2">{formatMoney(rawCost)}</td>
              </tr>
              <tr>
                <td colSpan="2">Phụ thu:</td>
                <td colSpan="2">{formatMoney(surcharge)}</td>
              </tr>
              <tr>
                <td colSpan="2">Giảm giá:</td>
                <td colSpan="2">{formatMoney(discount)}</td>
              </tr>
              <tr className="printing-bill-total-cost">
                <td colSpan="2">Tổng tiền:</td>
                <td colSpan="2">{formatMoney(totalCost)}</td>
              </tr>
            </tbody>
          </Table>
          {discountDescription && <p>* Giảm giá: {discountDescription}</p>}
        </div>
        <div className="printing-bill-footer">
          <p className="text-center">Cảm ơn quý khách!</p>
        </div>
      </div>
    );
  }
}

export default PrintableBill;
