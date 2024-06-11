import { Row, Col, Card, Select, Button } from 'antd';
import './BookingPage.scss';

const { Option } = Select;

const BookingPage = () => {
  // Sample data for demonstration
  // const halls = ['Hall A', 'Hall B', 'Hall C'];
  const timings = [ '3:00 PM  - 9:00 PM'];

  return (
    <div className="bookingPage__container">
      <Row justify="center" gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Book a Hall" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <h3>TMA Pai Hall</h3>
                
              </Col>
              <Col span={24}>
                <h3>Timing Slots Available</h3>
                <Select placeholder="Select a Timing" style={{ width: '100%' }}>
                  {timings.map((timing, index) => (
                    <Option key={index} value={timing}>
                      {timing}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={24}>
                <h3>Booking Slot (From - To)</h3>
                {/* You can add a date picker here for selecting booking dates */}
                {/* For simplicity, let's just display text inputs */}
                <Row gutter={[16, 0]}>
                  <Col span={12}>
                    <input type="text" placeholder="From" style={{ width: '100%' }} />
                  </Col>
                  <Col span={12}>
                    <input type="text" placeholder="To" style={{ width: '100%' }} />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Button block>Confirm Booking</Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BookingPage;
