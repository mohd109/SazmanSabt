
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use tokio_pg_mapper_derive::PostgresMapper;

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct User {
    pub _id: ObjectId,
    pub user_name: String,
    pub phone_number: String,
    pub email: String,
    pub password: String,
    pub image: String,
    pub id_card: String,
    pub gender: String,
    pub birth: String,
    pub post_code: String,
    pub addr: String,
    pub city: String,
    pub bank_account: String,
    pub active: String,
    pub id_code: String,
}

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Login {
    pub user_name: String,
    pub email: String,
    pub password: String
}

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Register {
    pub phone_number: String,
    pub email: String,
    pub password: String
}

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct VUser {
    pub _id: ObjectId,
    pub phone_number: String,
    pub vcode: String,
}
#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Admin {
    pub _id: ObjectId,
    pub user_name: String,
    pub phone_number: String,
    pub email: String,
    pub password: String,
}

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct News {
    pub _id: ObjectId,
    pub title:  String,
    pub content: String,
    pub image: String,
    pub date: String,
}
#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Blog {
    pub _id: ObjectId,
    pub title:  String,
    pub content: String,
    pub image: String,
    pub date: String,
    pub cat: f32,
}
#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Transaction {
    pub _id: ObjectId,
    pub currency:  String,
    pub unit_price: String,
    pub amount: String,
    pub total_price: String,
    pub network_type: String,
    pub fee:  String,
    pub time: String,
    pub txid: String,
    pub status: String,
    pub user_name: String,
}
#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Cat {
    pub _id: ObjectId,
    pub title:  String,
}
#[derive(Clone, Debug, PartialEq, Deserialize, Serialize, PostgresMapper)]
#[pg_mapper(table = "tiles")]
pub struct Land {
    pub title:  String,
    pub current_owner: String,
    pub price: f64,
    pub district: i32,
    pub status: i32,
    pub group_id:i32,
    pub token_id:i32,
}
#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Lands {
    pub lands: Vec<String>,
}

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct buyLands {
    pub landNames: Vec<String>,
    pub buyer: String,
    pub reciept: String
}
#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct SaleTime {
    pub dailySaleStart: String,
    pub dailySaleFinish: String,

}
#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct CaptchaResponse {
    pub big: String,
    pub small: String,
    pub uid:u32,
    pub y:u32
}
#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Captcha {
    pub uid:u32,    
    pub uimgx:u32
}
#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct TokenURI {
    pub name: String,
    pub description: String,
    pub image: String,
    pub district: String,
    pub price:String,
}

// new models from gps backend
#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Report {
    pub report_name: String,
    pub report_position: String,
    pub report_type: String,
    pub report_usage_type: String,
    pub report_delivery:String,
    pub report_address:String,
    pub report_img:String,
}

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Device {
    pub device_id: String,
    pub device_number: String,
    pub device_owner_name: String,
    pub device_owner_number: String,
    pub device_expire_account:String,
}

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Car {
    pub car_has_tracker:  String,
    pub car_name:  String,
    pub car_license_plate:  String,
    pub car_vin:  String,
    pub car_color:  String,
    pub car_typee:  String,
    pub car_subtype:  String,
    pub car_model:  String,
    pub car_depot:  String,
    pub car_tags:  String,
    pub car_payload:  String,
    pub car_cargo_cap:  String,
    pub car_gross_weight:  String,
    pub car_passengers_cap:  String,
    pub car_wheel_total:  String,
    pub car_wheel_drive:  String,
    pub car_tire_size:  String,
    pub car_tire_count:  String,
    pub car_permitted_speed:  String,
    pub car_chassis_number:  String,
    pub car_trailer:  String,
    pub car_manufacture_year:  String,
    pub car_fuel_type:  String,
    pub car_fuel_grade:  String,
    pub car_fuel_cost:  String,
    pub car_tank_cap:  String,
    pub car_fuel_cons:  String,
    pub car_ins_pol:  String,
    pub car_ins_valid:  String,
    pub car_ins2_pol:  String,
    pub car_ins2_valid:  String,
    pub car_driver_name: String,
    pub car_driver_number: String,
    pub car_al: String,
    pub car_org: String,
    pub car_device_id: String,
}

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct ProtocolRecord {
    pub Start_Bit: String,
    pub Packet_Length: String,
    pub Protocol_Number: String,
    pub Information_Content: String,
    pub Information_Serial_Number:String,
    pub Error_Check:String,
    pub Stop_Bit:String,
}

pub struct ProtocolPacketFormat {
    pub _id: String,
    pub Start_Bit: String,
    pub Packet_Length: String,
    pub Protocol_Number: String,
    pub Information_Content: String,
    pub Information_Serial_Number: String,
    pub Error_Check: String,
    pub Stop_Bit : String,
}

pub struct EmptyResponse {
    pub Start_Bit: Vec<u8>,
    pub Packet_Length: Vec<u8>,
    pub Protocol_Number: Vec<u8>,
    pub Information_Serial_Number: Vec<u8>,
    pub Error_Check: Vec<u8>,
    pub Stop_Bit : Vec<u8>,
}


pub struct LoginPacket_Message {
    pub Terminal_ID: Vec<u8>,
    pub Model_Identification_Code: Vec<u8>,
    pub Time_Zone_Language: Vec<u8>,
}

//EmptyResponse

pub struct HeartBeatPacket_Message {
    pub Terminal_Information_Content: Vec<u8>,
    pub External_voltage: Vec<u8>,
    pub Built_in_battery_voltage: Vec<u8>,
    pub GSM_Signal_Strength: Vec<u8>,
    pub Extended_Port_Status: Vec<u8>,
}


//EmptyResponse

pub struct GPSLocPacket_Message {
    pub Date_Time: Vec<u8>,
    pub Quantity_GPS_sat: Vec<u8>,
    pub Latitude: Vec<u8>,
    pub Longitude: Vec<u8>,
    pub Speed: Vec<u8>,
    pub Course_Status: Vec<u8>,
    pub MCC: Vec<u8>,
    pub MNC: Vec<u8>,
    pub LAC: Vec<u8>,
    pub Cell_ID: Vec<u8>,
    pub ACC: Vec<u8>,
    pub Data_Upload_Mode: Vec<u8>,
    pub GPS_RT_upload: Vec<u8>,
    pub Mileage: Vec<u8>,
}
//No Response

pub struct LBSPacket_Message {
    pub DATE_UTC: Vec<u8>,
    pub MCC: Vec<u8>,
    pub MNC: Vec<u8>,
    pub LAC: Vec<u8>,
    pub CI: Vec<u8>,
    pub RSSI: Vec<u8>,
    pub NLAC1: Vec<u8>,
    pub NCI1: Vec<u8>,
    pub NRSSI1: Vec<u8>,
    pub NLAC2: Vec<u8>,
    pub NCI2: Vec<u8>,
    pub NRSSI2: Vec<u8>,
    pub NLAC3: Vec<u8>,
    pub NCI3: Vec<u8>,
    pub NRSSI3: Vec<u8>,
    pub NLAC4: Vec<u8>,
    pub NCI4: Vec<u8>,
    pub NRSSI4: Vec<u8>,
    pub NLAC5: Vec<u8>,
    pub NCI5: Vec<u8>,
    pub NRSSI5: Vec<u8>,
    pub NLAC6: Vec<u8>,
    pub NCI6: Vec<u8>,
    pub NRSSI6: Vec<u8>,
    pub Timing_Advance: Vec<u8>,
    pub Alarm_Language: Vec<u8>,
}

//No Response

pub struct WifiPacket_Message {
    pub Date_Time_UTC: Vec<u8>,
    pub MCC: Vec<u8>,
    pub MNC: Vec<u8>,
    pub LAC: Vec<u8>,
    pub CI: Vec<u8>,
    pub RSSI: Vec<u8>,
    pub NLAC1: Vec<u8>,
    pub NCI1: Vec<u8>,
    pub NRSSI1: Vec<u8>,
    pub NLAC2: Vec<u8>,
    pub NCI2: Vec<u8>,
    pub NRSSI2: Vec<u8>,
    pub NLAC3: Vec<u8>,
    pub NCI3: Vec<u8>,
    pub NRSSI3: Vec<u8>,
    pub NLAC4: Vec<u8>,
    pub NCI4: Vec<u8>,
    pub NRSSI4: Vec<u8>,
    pub NLAC5: Vec<u8>,
    pub NCI5: Vec<u8>,
    pub NRSSI5: Vec<u8>,
    pub NLAC6: Vec<u8>,
    pub NCI6: Vec<u8>,
    pub NRSSI6: Vec<u8>,
    pub Time_leads: Vec<u8>,
    pub WiFi_quantity: Vec<u8>,
    pub WIFI_MAC1: Vec<u8>,
    pub WIFI_strength_1: Vec<u8>,
    pub WIFI_MAC2: Vec<u8>,
    pub WIFI_strength_2: Vec<u8>,
}

//No Response

pub struct AlarmPacket_Message {
    pub Date_Time: Vec<u8>,
    pub Quantity_GPS_sat: Vec<u8>,
    pub Latitude: Vec<u8>,
    pub Longitude: Vec<u8>,
    pub Speed: Vec<u8>,
    pub Course_Status: Vec<u8>,
    pub LBS_length: Vec<u8>,
    pub MCC: Vec<u8>,
    pub MNC: Vec<u8>,
    pub LAC: Vec<u8>,
    pub Cell_ID: Vec<u8>,
    pub Terminal_Information: Vec<u8>,
    pub Built_in_battery_voltage: Vec<u8>,
    pub GSM_Signal_Strength: Vec<u8>,
    pub Alarm_Language: Vec<u8>,
    pub Mileage: Vec<u8>,
}
//EmptyResponse

pub struct AlarmPacket_MultiFence_Message {
    pub Date_Time: Vec<u8>,
    pub Quantity_GPS_sat: Vec<u8>,
    pub Latitude: Vec<u8>,
    pub Longitude: Vec<u8>,
    pub Speed: Vec<u8>,
    pub Course_Status: Vec<u8>,
    pub LBS_length: Vec<u8>,
    pub MCC: Vec<u8>,
    pub MNC: Vec<u8>,
    pub LAC: Vec<u8>,
    pub Cell_ID: Vec<u8>,
    pub Terminal_Information: Vec<u8>,
    pub Built_in_battery_voltage: Vec<u8>,
    pub GSM_Signal_Strength: Vec<u8>,
    pub Alarm_Language: Vec<u8>,
    pub Fence_No: Vec<u8>,
    pub Mileage: Vec<u8>,
}
//EmptyResponse

pub struct AlarmLBSPacket_Message {
    pub MCC: Vec<u8>,
    pub MNC: Vec<u8>,
    pub LAC: Vec<u8>,
    pub Cell_ID: Vec<u8>,
    pub Terminal_Information: Vec<u8>,
    pub Voltage_Level: Vec<u8>,
    pub GSM_Signal_Strength: Vec<u8>,
    pub Alarm_Language: Vec<u8>,
}
//EmptyResponse

pub struct OnlineCommandPacket_Message {
    pub Command_Length: Vec<u8>,
    pub Server_Flag_Bit: Vec<u8>,
    pub Command_Content: Vec<u8>,
    pub Language: Vec<u8>,
}
pub struct OnlineCommandPacket_JM01_Response {
    pub Command_Length: Vec<u8>,
    pub Server_Flag_Bit: Vec<u8>,
    pub Content_Code: Vec<u8>,
    pub Content: Vec<u8>,
}
pub struct OnlineCommandPacket_Response {
    pub Server_Flag_Bit: Vec<u8>,
    pub Content_Code: Vec<u8>,
    pub Content: Vec<u8>,
}

//TimeCalPacket_Message is like EmptyResponse
pub struct TimeCalPacket_Response {
    pub Date_Time: Vec<u8>,
}

pub struct InfoTransPacket_Message {
    pub Info_Type: Vec<u8>,
    pub Data_Content: Vec<u8>,
}
//NoResponse

pub struct DeviceTransparentData_Message {
    pub Module_Type: Vec<u8>,
    pub Transparent_Content: Vec<u8>,
}
//SameAsMessag

pub struct LargeFileTransfer_Message {
    pub File_Type: Vec<u8>,
    pub File_Length: Vec<u8>,
    pub File_Error_Check_Type: Vec<u8>,
    pub Start_Bit: Vec<u8>,
    pub Current_Content_Length: Vec<u8>,
    pub Content: Vec<u8>,
    pub Flag_Bit: Vec<u8>,
}

