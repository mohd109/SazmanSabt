mod model;
use crate::config::ExampleConfig;
use crate::errors::MyError;
use actix_web::web::Data;
use ::config::Config;
use actix_identity::Identity;
use actix_identity::IdentityMiddleware;
use actix_session::{SessionMiddleware, storage::RedisActorSessionStore};
use actix_web::http::StatusCode;
use actix_web::HttpMessage;
use actix_web::{cookie::Key,get, post, web, App, HttpResponse, HttpServer, ResponseError,HttpRequest};
use bson::oid::ObjectId;
use chrono::{DateTime, Utc};
use deadpool_postgres::{Client as Client2, Pool};
use dotenv::dotenv;
use image::GenericImageView;
use image::{imageops, DynamicImage, ImageOutputFormat};
use model::*;
use mongodb::{bson::doc, options::IndexOptions, Client, Collection, IndexModel};
use rand::Rng;
use serde::Serialize;
use serde_json::{json, to_string_pretty};
use std::fmt::{Display, Formatter, Result as FmtResult};
use std::io::Cursor;
use std::sync::Mutex;
use std::net::{IpAddr, Ipv4Addr, Ipv6Addr};
use tokio_pg_mapper::FromTokioPostgresRow;
use tokio_postgres::NoTls;
use std::collections::HashMap;
use openssl::ssl::{SslAcceptor, SslFiletype, SslMethod};
use std::env;
use deadpool_postgres::{Manager, ManagerConfig, RecyclingMethod};

mod config {
    use serde::Deserialize;
    #[derive(Debug, Default, Deserialize)]
    pub struct ExampleConfig {
        pub pg: deadpool_postgres::Config,
    }
}
mod errors {
    use actix_web::{HttpResponse, ResponseError};
    use deadpool_postgres::PoolError;
    use derive_more::{Display, From};
    use tokio_pg_mapper::Error as PGMError;
    use tokio_postgres::error::Error as PGError;

    #[derive(Display, From, Debug)]
    pub enum MyError {
        NotFound,
        PGError(PGError),
        PGMError(PGMError),
        PoolError(PoolError),
    }
    impl std::error::Error for MyError {}

    impl ResponseError for MyError {
        fn error_response(&self) -> HttpResponse {
            match *self {
                MyError::NotFound => HttpResponse::NotFound().finish(),
                MyError::PoolError(ref err) => {
                    HttpResponse::InternalServerError().body(err.to_string())
                }
                _ => HttpResponse::InternalServerError().finish(),
            }
        }
    }
}

#[derive(Debug, Serialize)]
pub struct Error {
    pub message: String,
    pub status: u16,
}
impl Display for Error {
    fn fmt(&self, f: &mut Formatter) -> FmtResult {
        write!(f, "{}", to_string_pretty(self).unwrap())
    }
}

impl ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        let err_json = json!({ "error": self.message });
        HttpResponse::build(StatusCode::from_u16(self.status).unwrap()).json(err_json)
    }
}

//DB and Collection names
const DB_NAME: &str = "atlasavl";
const USER_COLL: &str = "users";
const ADMIN_COLL: &str = "admins";
const BLOG_COLL: &str = "blogs";
const NEWS_COLL: &str = "news";
const CAT_COLL: &str = "cats";
const TRANS_COLL: &str = "trans";
const VUSER_COLL: &str = "vusers";
const LAND_COLL: &str = "lands";
const CAR_COLL: &str = "cars";
const DEVICE_COLL: &str = "devices";
const REPORT_COLL: &str = "reports";

fn image_to_base64(img: DynamicImage) -> String {
    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), ImageOutputFormat::Png)
        .unwrap();
    let res_base64 = base64::encode(image_data);
    format!("data:image/png;base64,{}", res_base64)
}

#[post("/captcha_verification")]
async fn captcha_verification(_imgs: web::Data<Vec<image::DynamicImage>>,data: Data<Mutex<captcha_data>>, _id: Identity,form: web::Json<Captcha>) -> HttpResponse {
    let tempform = form.into_inner().clone();
    let uimgx = tempform.uimgx;
    let uid = tempform.uid;

    let dataa = data.lock().unwrap();
    
    if dataa.uids.contains(&uid) {
        let index = dataa.uids.iter().position(|&r| r == uid).unwrap();
        println!("{}", dataa.uimgs[index].abs_diff(uimgx)<6);
        println!("{}", dataa.uimgs[index]);
        println!("{}", uimgx);

        if dataa.uimgs[index].abs_diff(uimgx)<6 {
            return HttpResponse::Ok().json("Ok");
        }
    }
    else{
        return HttpResponse::Forbidden().json("Failure1");
    }
    HttpResponse::Forbidden().json("Failure")
}

#[get("/captcha")]
async fn captcha(imgs: web::Data<Vec<image::DynamicImage>>,data: Data<Mutex<captcha_data>>, _id: Identity) -> HttpResponse {

    let mut dataa = data.lock().unwrap();

    let subimg;
    let mut rng = rand::thread_rng();
    let smallx=50;
    let smally=50;
    let n: usize = rng.gen_range(0..imgs.len());
    // let mut img:image::DynamicImage = ;
    let (width, height) = imgs[n].dimensions();
    let x: u32 = rng.gen_range(1..width - smallx-1);
    let y: u32 = rng.gen_range(1..height - smally-1);

    let uid: u32 = rng.gen_range(1000000000..4294967294);
    if !dataa.uids.contains(&uid) {
        dataa.uids.push(uid);
        dataa.uimgs.push(x);
    }
    else{
        let uid: u32 = rng.gen_range(1000000000..4294967294);
        if !dataa.uids.contains(&uid) {
            dataa.uids.push(uid);
            dataa.uimgs.push(x);
            
        }
    }

    let mut tempimg = imgs[n].clone();
    subimg = imageops::crop(&mut tempimg, x, y, smallx, smally);

    let bigImage = image_to_base64(DynamicImage::ImageRgba8(imgs[n].to_rgba8()));
    let smallImage = image_to_base64(DynamicImage::ImageRgba8(subimg.to_image()));
    println!("{}", x);
    let resp = CaptchaResponse {
        big: bigImage,
        small: smallImage,
        uid: uid,
        y: y
    };
    HttpResponse::Ok().json(resp)
}

#[get("/index_user")]
async fn index_user(_client: web::Data<Client>, id: Option<Identity>) -> String {
    if let Some(user) = id {
        format!("Welcome! {}", user.id().unwrap())
    } else {
        "Welcome Anonymous!".to_owned()
    }
}
#[post("/login_user")]
async fn login_user(
    client: web::Data<Client>,
    _id: Identity,
    form: web::Json<Login>,
    request: HttpRequest
) -> HttpResponse {
    let tempform = form.into_inner().clone();
    let mut loginval = "";
    let mut logincri = "";
    let password = tempform.password;

    if tempform.user_name.len() > 0 {
        logincri = "user_name";
        loginval = &tempform.user_name;
    } else if tempform.email.len() > 0 {
        logincri = "email";
        loginval = &tempform.email;
    } else if password.len() == 0 {
        return HttpResponse::NotFound().body(format!("No user found with username {}", loginval));
    }

    let collection: Collection<User> = client.database(DB_NAME).collection(USER_COLL);
    match collection
        .find_one(doc! { logincri: loginval,"password": &password }, None)
        .await
    {
        Ok(Some(user)) => {
            Identity::login(&request.extensions(), user.user_name.to_owned().to_string()).unwrap();

            if user.user_name.len() > 0 {
                HttpResponse::Ok().json(user.user_name.to_owned().to_string())
            } else {
                HttpResponse::Ok().json(user.email.to_owned().to_string())
            }
        }
        Ok(None) => {
            HttpResponse::NotFound().body(format!("No user found with username {}", loginval))
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}
#[get("/logout_user")]
async fn logout_user(id: Identity) -> HttpResponse {
    id.logout();

    HttpResponse::Found()
        .insert_header(("location", "/"))
        .finish()
}
#[get("/get_sale_time")]
async fn get_sale_time(_id: Identity) -> HttpResponse {
    let salestart = chrono::Utc::today().and_hms(8, 00, 00);
    let salefinish = chrono::Utc::today().and_hms(22, 00, 00);
    let st = SaleTime {
        dailySaleStart: salestart.to_string(),
        dailySaleFinish: salefinish.to_string(),
    };
    HttpResponse::Ok().json(st)
}
//admin requests
#[get("/index_admin")]
async fn index_admin(id: Option<Identity>) -> String {
    if let Some(user) = id {
        format!("Welcome! {}", user.id().unwrap())
    } else {
        "Welcome Anonymous!".to_owned()
    }
}

#[post("/login_admin")]
async fn login_admin(
    client: web::Data<Client>,
    _id: Identity,
    form: web::Json<Login>,
    request: HttpRequest
) -> HttpResponse {
    let tempform = form.into_inner().clone();
    let mut loginval = "";
    let mut logincri = "";
    let password = tempform.password;

    if tempform.user_name.len() > 0 {
        logincri = "user_name";
        loginval = &tempform.user_name;
    } else if tempform.email.len() > 0 {
        logincri = "email";
        loginval = &tempform.email;
    } else if password.len() == 0 {
        return HttpResponse::NotFound().body(format!("No user found with username {}", loginval));
    }

    let collection: Collection<Admin> = client.database(DB_NAME).collection(ADMIN_COLL);
    match collection
        .find_one(doc! { logincri: loginval,"password": &password }, None)
        .await
    {
        Ok(Some(user)) => {
            Identity::login(&request.extensions(), user._id.to_owned().to_string()).unwrap();
            HttpResponse::Ok().json("success")
        }
        Ok(None) => {
            HttpResponse::NotFound().body(format!("No admin found with username {}", loginval))
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }

    // id.remember("admin1".to_owned());
    // HttpResponse::Found()
    //     .insert_header(("location", "/"))
    //     .finish()
}
#[get("/logout_admin")]
async fn logout_admin(id: Identity) -> HttpResponse {
    id.logout();

    HttpResponse::Found()
        .insert_header(("location", "/"))
        .finish()
}

/// Adds a new user to the "users" collection in the database.
#[post("/add_user")]
async fn add_user(
    client: web::Data<Client>,
    _id: Identity,
    form: web::Json<Register>,
) -> HttpResponse {
    let tempform = form.into_inner().clone();
    let user_phone_exists: bool =
        check_user(&client, "phone_number", &(tempform.phone_number.clone())).await;
    let user_email_exists: bool =
        check_user(&client, "email", &(tempform.email.to_lowercase().clone())).await;
    if !user_phone_exists && !user_email_exists {
        let empty_id = ObjectId::new();
        let usr = User {
            _id: empty_id,
            user_name: "".to_string(),
            phone_number: tempform.phone_number,
            email: tempform.email,
            password: tempform.password,
            image: "".to_string(),
            id_card: "".to_string(),
            gender: "".to_string(),
            birth: "".to_string(),
            post_code: "".to_string(),
            addr: "".to_string(),
            city: "".to_string(),
            bank_account: "".to_string(),
            active: "".to_string(),
            id_code: "".to_string(),
        };
        let collection = client.database(DB_NAME).collection(USER_COLL);
        let result = collection.insert_one(usr, None).await;
        //check result

        match result {
            Ok(_) => return HttpResponse::Ok().body("user added successfully"),
            Err(err) => return HttpResponse::InternalServerError().body(err.to_string()),
        };

        // HttpResponse::Ok().body("uncaught error".to_string())
    } else if user_phone_exists {
        HttpResponse::InternalServerError().body("phone number aready exists".to_string())
    } else {
        HttpResponse::InternalServerError().body("email aready exists".to_string())
    }
}
#[get("/get_users")]
async fn get_users(client: web::Data<Client>, id: Identity) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let collection: Collection<User> = client.database(DB_NAME).collection(USER_COLL);
        match collection.find(None, None).await {
            Ok(mut cursor) => {
                let mut result: Vec<User> = Vec::new();
                while cursor.advance().await.unwrap() {
                    result.push(cursor.deserialize_current().unwrap());
                }

                Ok(HttpResponse::Ok().json(result))
            }
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}
#[get("/get_lands_uri/{token_id}")]
async fn get_lands_uri(
    db_pool: web::Data<Pool>,
    id: Identity,
    token_id: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {

        let client2: Client2 = db_pool.get().await.map_err(MyError::PoolError).unwrap();

        let _stmt =
            "SELECT title,price,district,status,group_id FROM tiles WHERE token_id = "
                .to_string()
                + &token_id.to_owned().to_string();
        let stmt = client2.prepare(&_stmt).await.unwrap();

        let _result: Vec<Land> = Vec::new();
        let tempResult;
        let tempResult1 = client2.query(&stmt, &[]).await;
        if tempResult1.is_ok() {
            tempResult = tempResult1
                .ok()
                .unwrap()
                .iter()
                .map(|row| Land::from_row_ref(row).unwrap())
                .collect::<Vec<Land>>()
                .pop()
                .ok_or(MyError::NotFound);

            if tempResult.is_ok() {
                let land_data=tempResult.ok().unwrap();
                let token_info = TokenURI{
                    name: land_data.title.to_string(),
                    description: "".to_owned(),
                    image: "https://teh.land/token_position/".to_owned() + &token_id.to_owned().to_string(),
                    district: land_data.district.to_string(),
                    price:land_data.price.to_string(),
                };
                Ok(HttpResponse::Ok().json(token_info))
            } else {
                Err(Error {
                    message: MyError::NotFound.to_string(),
                    status: 500,
                })
            }
        } else {
            Err(Error {
                message: "error in querying lands".to_string(),
                status: 500,
            })
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}


/// Gets the user with the supplied username.
#[get("/get_user/{username}")]
async fn get_user(
    client: web::Data<Client>,
    _id: Identity,
    username: web::Path<String>,
) -> HttpResponse {
    let username = username.into_inner();
    let collection: Collection<User> = client.database(DB_NAME).collection(USER_COLL);
    match collection
        .find_one(doc! { "username": &username }, None)
        .await
    {
        Ok(Some(user)) => HttpResponse::Ok().json(user),
        Ok(None) => {
            HttpResponse::NotFound().body(format!("No user found with username {}", username))
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}
#[get("/delete_user/{username}")]
async fn delete_user(
    client: web::Data<Client>,
    id: Identity,
    username: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let username = username.into_inner();
        let collection: Collection<User> = client.database(DB_NAME).collection(USER_COLL);
        match collection
            .delete_one(doc! { "user_name": &username }, None)
            .await
        {
            Ok(_) => Ok(HttpResponse::Ok().body("user deleted")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

#[post("/edit_user_image/{user_id}")]
async fn edit_user_image(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<User>,
    user_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id1 = id.id().unwrap() {
        let user_id = user_id.into_inner();
        let collection: Collection<User> = client.database(DB_NAME).collection(USER_COLL);
        let request_user = form.into_inner();

        let doc = doc! {
            "image": request_user.image,
        };
        match collection
            .update_one(doc! { "_id": user_id }, doc, None)
            .await
        {
            Ok(_) => Ok(HttpResponse::Ok().body("user edited")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

#[post("/edit_user_password/{user_id}")]
async fn edit_user_password(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<User>,
    user_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id1 = id.id().unwrap() {
        let user_id = user_id.into_inner();
        let collection: Collection<User> = client.database(DB_NAME).collection(USER_COLL);
        let request_user = form.into_inner();

        let doc = doc! {
            "password": request_user.password,
        };
        match collection
            .update_one(doc! { "_id": user_id }, doc, None)
            .await
        {
            Ok(_) => Ok(HttpResponse::Ok().body("user edited")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

#[post("/edit_user_kyc/{user_id}")]
async fn edit_user_kyc(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<User>,
    user_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id1 = id.id().unwrap() {
        let user_id = user_id.into_inner();
        let collection: Collection<User> = client.database(DB_NAME).collection(USER_COLL);
        let request_user = form.into_inner();

        let doc = doc! {
            "id_card": request_user.id_card,
            "id_code": request_user.id_code,
            "bank_account": request_user.bank_account,
        };
        match collection
            .update_one(doc! { "_id": user_id }, doc, None)
            .await
        {
            Ok(_) => Ok(HttpResponse::Ok().body("user edited")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

#[post("/edit_user_phone/{user_id}")]
async fn edit_user_phone(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<User>,
    user_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id1 = id.id().unwrap() {
        let user_id = user_id.into_inner();
        let collection: Collection<User> = client.database(DB_NAME).collection(USER_COLL);
        let request_user = form.into_inner();

        let doc = doc! {
            "phone_number": request_user.id_card,
        };
        match collection
            .update_one(doc! { "_id": user_id }, doc, None)
            .await
        {
            Ok(_) => Ok(HttpResponse::Ok().body("user edited")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

#[post("/edit_user/{user_id}")]
async fn edit_user(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<User>,
    user_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id1 = id.id().unwrap() {
        let user_id = user_id.into_inner();
        let collection: Collection<User> = client.database(DB_NAME).collection(USER_COLL);
        let request_user = form.into_inner();

        let doc = doc! {
            "gender": request_user.gender,
            "birth": request_user.birth,
            "post_code": request_user.post_code,
            "addr": request_user.addr,
            "city": request_user.city,
        };
        match collection
            .update_one(doc! { "_id": user_id }, doc, None)
            .await
        {
            Ok(_) => Ok(HttpResponse::Ok().body("user edited")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

//Land Requests
#[post("/get_lands")]
async fn get_lands(
    db_pool: web::Data<Pool>,
    _client: web::Data<Client>,
    id: Identity,
    form: web::Json<Lands>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        //MONGODB
        // let collection: Collection<Land> = client.database(DB_NAME).collection(LAND_COLL);

        // match collection
        //     .find(Some(doc! {"title": {"$in": form.into_inner().lands}}), None)
        //     .await
        // {
        //     Ok(mut cursor) => {
        //         let mut result: Vec<Land> = Vec::new();
        //         while cursor.advance().await.unwrap() {
        //             result.push(cursor.deserialize_current().unwrap());
        //         }

        //         Ok(HttpResponse::Ok().json(result))
        //     }
        //     Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        // }

        //POSTGRES
        let client2: Client2 = db_pool.get().await.map_err(MyError::PoolError).unwrap();

        let landss = form.into_inner().lands;
        let mut landNames = "(".to_string() + "\'" + &landss[0] + "\'";
        for i in 1..landss.len() {
            landNames = landNames + "," + "\'" + &landss[i] + "\'";
        }
        landNames = landNames + ")";
        let _stmt =
            "SELECT title,current_owner,price,district,status,group_id,token_id FROM tiles WHERE title IN "
                .to_string()
                + &landNames;
        let stmt = client2.prepare(&_stmt).await.unwrap();

        let _result: Vec<Land> = Vec::new();
        let tempResult;
        let tempResult1 = client2.query(&stmt, &[]).await;
        if tempResult1.is_ok() {
            tempResult = tempResult1
                .ok()
                .unwrap()
                .iter()
                .map(|row| Land::from_row_ref(row).unwrap())
                .collect::<Vec<Land>>()
                .pop()
                .ok_or(MyError::NotFound);

            if tempResult.is_ok() {
                Ok(HttpResponse::Ok().json(tempResult.ok().unwrap()))
            } else {
                Err(Error {
                    message: MyError::NotFound.to_string(),
                    status: 500,
                })
            }
        } else {
            Err(Error {
                message: "error in querying lands".to_string(),
                status: 500,
            })
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

#[post("/add_land")]
async fn add_land(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<Land>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let collection = client.database(DB_NAME).collection(LAND_COLL);
        let result = collection.insert_one(form.into_inner(), None).await;
        match result {
            Ok(_) => Ok(HttpResponse::Ok().body("land added")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

/// Gets the user with the supplied username.
#[get("/get_land/{land_id}")]
async fn get_land(
    db_pool: web::Data<Pool>,
    id: Identity,
    land_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        // let oid = land_id.into_inner();
        // let land_id = ObjectId::parse_str(oid).unwrap();

        // let collection: Collection<Land> = client.database(DB_NAME).collection(LAND_COLL);
        // match collection.find_one(doc! { "_id": land_id }, None).await {
        //     Ok(Some(land)) => Ok(HttpResponse::Ok().json(land)),
        //     Ok(None) => Ok(
        //         HttpResponse::NotFound().body(format!("No land found with land_id {}", land_id))
        //     ),
        //     Err(err) => {
        //         println!("the error is {}", err.to_string());
        //         Ok(HttpResponse::InternalServerError().body(err.to_string()))
        //     }
        // }
        let client2: Client2 = db_pool.get().await.map_err(MyError::PoolError).unwrap();

        let _stmt =
            "SELECT title,current_owner,price,district,status,group_id,token_id FROM tiles WHERE title = "
                .to_string()
                + &land_id.into_inner();
        let stmt = client2.prepare(&_stmt).await.unwrap();

        let _result: Vec<Land> = Vec::new();
        let tempResult;
        let tempResult1 = client2.query(&stmt, &[]).await;
        if tempResult1.is_ok() {
            tempResult = tempResult1
                .ok()
                .unwrap()
                .iter()
                .map(|row| Land::from_row_ref(row).unwrap())
                .collect::<Vec<Land>>()
                .pop()
                .ok_or(MyError::NotFound);

            if tempResult.is_ok() {
                Ok(HttpResponse::Ok().json(tempResult.ok().unwrap()))
            } else {
                Err(Error {
                    message: MyError::NotFound.to_string(),
                    status: 500,
                })
            }
        } else {
            Err(Error {
                message: "error in querying lands".to_string(),
                status: 500,
            })
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}
/// Gets the user with the supplied username.
#[get("/query_lands/{user_id}")]
async fn query_lands(
    db_pool: web::Data<Pool>,
    id: Identity,
    user_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id1 = id.id().unwrap() {
        // let oid = user_id.into_inner();
        // let user_id = ObjectId::parse_str(oid).unwrap();

        // let collection: Collection<Land> = client.database(DB_NAME).collection(LAND_COLL);
        // match collection
        //     .find_one(doc! { "current_owner": user_id }, None)
        //     .await
        // {
        //     Ok(Some(land)) => Ok(HttpResponse::Ok().json(land)),
        //     Ok(None) => Ok(
        //         HttpResponse::NotFound().body(format!("No land found with land_id {}", user_id))
        //     ),
        //     Err(err) => {
        //         println!("the error is {}", err.to_string());
        //         Ok(HttpResponse::InternalServerError().body(err.to_string()))
        //     }
        // }
        let client2: Client2 = db_pool.get().await.map_err(MyError::PoolError).unwrap();

        let _stmt = "SELECT title,current_owner,price,district,status,group_id,token_id FROM tiles WHERE current_owner = ".to_string() + &user_id.into_inner();
        let stmt = client2.prepare(&_stmt).await.unwrap();

        let _result: Vec<Land> = Vec::new();
        let tempResult;
        let tempResult1 = client2.query(&stmt, &[]).await;
        if tempResult1.is_ok() {
            tempResult = tempResult1
                .ok()
                .unwrap()
                .iter()
                .map(|row| Land::from_row_ref(row).unwrap())
                .collect::<Vec<Land>>()
                .pop()
                .ok_or(MyError::NotFound);

            if tempResult.is_ok() {
                Ok(HttpResponse::Ok().json(tempResult.ok().unwrap()))
            } else {
                Err(Error {
                    message: MyError::NotFound.to_string(),
                    status: 500,
                })
            }
        } else {
            Err(Error {
                message: "error in querying lands".to_string(),
                status: 500,
            })
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}
/// Gets the user with the supplied username.
#[post("/get_land_group")]
async fn get_land_group(
    db_pool: web::Data<Pool>,
    id: Identity,
    form: web::Json<Land>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let request_group = form.into_inner();
        let group_id = request_group.group_id as i32;
        let current_owner = request_group.current_owner as String;
        // let collection: Collection<Land> = client.database(DB_NAME).collection(LAND_COLL);
        // match collection
        //     .find(
        //         doc! { "group_id": group_id,"current_owner":current_owner },
        //         None,
        //     )
        //     .await
        // {
        //     Ok(mut cursor) => {
        //         let mut result: Vec<Land> = Vec::new();
        //         while cursor.advance().await.unwrap() {
        //             result.push(cursor.deserialize_current().unwrap());
        //         }
        //         Ok(HttpResponse::Ok().json(result))
        //     }
        //     Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        // }
        let client2: Client2 = db_pool.get().await.map_err(MyError::PoolError).unwrap();

        let _stmt = "SELECT title,current_owner,price,district,status,group_id,token_id FROM tiles WHERE current_owner = ".to_string() + &current_owner +" AND group_id = " + &group_id.to_string();
        let stmt = client2.prepare(&_stmt).await.unwrap();

        let tempResult;
        let tempResult1 = client2.query(&stmt, &[]).await;
        if tempResult1.is_ok() {
            tempResult = tempResult1
                .ok()
                .unwrap()
                .iter()
                .map(|row| Land::from_row_ref(row).unwrap())
                .collect::<Vec<Land>>()
                .pop()
                .ok_or(MyError::NotFound);

            if tempResult.is_ok() {
                Ok(HttpResponse::Ok().json(tempResult.ok().unwrap()))
            } else {
                Err(Error {
                    message: MyError::NotFound.to_string(),
                    status: 500,
                })
            }
        } else {
            Err(Error {
                message: "error in querying lands".to_string(),
                status: 500,
            })
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

//for updating a land's current user
#[post("/transfer_land")]
async fn transfer_land(
    db_pool: web::Data<Pool>,
    _client: web::Data<Client>,
    id: Identity,
    form: web::Json<buyLands>,
    restClient: web::Data<reqwest::Client>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        //MONGODB
        // let land_id = land_id.into_inner();
        // let collection: Collection<Land> = client.database(DB_NAME).collection(LAND_COLL);
        // let request_land = form.into_inner();
        // let doc = doc! {
        //     "current_owner": request_land.current_owner,
        // };
        // match collection
        //     .update_one(doc! { "_id": land_id }, doc, None)
        //     .await
        // {
        //     Ok(_) => Ok(HttpResponse::Ok().body("land edited")),
        //     Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        // }

        let salestart = chrono::Utc::today().and_hms(8, 00, 00);
        let salefinish = chrono::Utc::today().and_hms(22, 00, 00);
        let nowTime: DateTime<Utc> = Utc::now();
        if nowTime.signed_duration_since(salestart).num_seconds() > 0
            && nowTime.signed_duration_since(salefinish).num_seconds() < 0
        {
            //POSTGRES
            let request_land = form.into_inner();
            let landss = request_land.landNames;
            let desiredOwner = request_land.buyer;
            let reciept = request_land.reciept;
            // if landss..status ==1 || request_land.status==4
            // {
                let client2: Client2 = db_pool.get().await.map_err(MyError::PoolError).unwrap();

                let mut landNames = "(".to_string() + "\'" + &landss[0] + "\'";
                for i in 1..landss.len() {
                    landNames = landNames + "," + "\'" + &landss[i] + "\'";
                }
                landNames = landNames + ")";
                        
                let _stmt = "UPDATE tiles SET current_owner = ".to_string()
                    + "\'"
                    + &desiredOwner
                    + "\'"
                    + &", group_id = 1, status = 5 WHERE title IN ".to_string()
                    + &landNames
                    + " AND status IN (\'1\' ,\'4\') RETURNING title,current_owner,price,district,status,group_id,token_id";
                let stmt = client2.prepare(&_stmt).await.unwrap();
                println!("{}", _stmt);
                let tempResult;
                let tempResult1 = client2.query(&stmt, &[]).await;
                if tempResult1.is_ok() {
                    let tempLands = tempResult1
                    .ok()
                    .unwrap()
                    .iter()
                    .map(|row| Land::from_row_ref(row).unwrap())
                    .collect::<Vec<Land>>();

                    tempResult = tempLands.clone()
                        .pop()
                        .ok_or(MyError::NotFound);
                    
                    if tempResult.is_ok() {

                        let mut tokenIDs = "[".to_string() + &landss[0] ;
                        let mut totalPrice = 0.0;
                        for i in 1..tempLands.len() {
                            let token_id = tempLands[i].token_id;
                            totalPrice+=tempLands[i].price;
                            tokenIDs = tokenIDs + "," +  &token_id.to_owned().to_string() ;
                        }
                        tokenIDs = tokenIDs + "]";

                        let mut map = HashMap::new();
                        map.insert("recieverAdd", desiredOwner);
                        map.insert("tokenIDs", tokenIDs);
                        map.insert("reciept", reciept);
                        map.insert("cost", totalPrice.to_string());

                        let res = restClient.post("http://127.0.0.1:3120/transact")
                            .json(&map)
                            .send()
                            .await;
                        if res.is_ok()
                        {
                            let responseIsOK=res.ok().unwrap();

                            if responseIsOK.status()==StatusCode::ACCEPTED
                            {
                                let tokenResp = responseIsOK.text().await.unwrap();
                                Ok(HttpResponse::Ok().json(tokenResp))
                            }
                            else{
                                Err(Error {
                                    message: responseIsOK.status().to_string(),
                                    status: 500,
                                })
                            }
                        }
                        else{
                            Err(Error {
                                message: res.err().unwrap().to_string(),
                                status: 500,
                            })
                        }
                    } else {
                        Err(Error {
                            message: MyError::NotFound.to_string(),
                            status: 500,
                        })
                    }
                } else {
                    Err(Error {
                        message: "error in querying lands".to_string(),
                        status: 500,
                    })
                }
            // }
            // else{
            //     Err(Error {
            //         message: "You're not allowed to buy these lands".to_string(),
            //         status: 401,
            //     })
            // }
            
        } else {
            Err(Error {
                message: "Not in sale time".into(),
                status: 401,
            })
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}


//for updating a land's current user
#[post("/sell_land")]
async fn sell_land(
    db_pool: web::Data<Pool>,
    _client: web::Data<Client>,
    id: Identity,
    form: web::Json<Land>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        //MONGODB
        // let land_id = land_id.into_inner();
        // let collection: Collection<Land> = client.database(DB_NAME).collection(LAND_COLL);
        // let request_land = form.into_inner();
        // let doc = doc! {
        //     "current_owner": request_land.current_owner,
        // };
        // match collection
        //     .update_one(doc! { "_id": land_id }, doc, None)
        //     .await
        // {
        //     Ok(_) => Ok(HttpResponse::Ok().body("land edited")),
        //     Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        // }

        let salestart = chrono::Utc::today().and_hms(20, 00, 00);
        let salefinish = chrono::Utc::today().and_hms(22, 00, 00);
        let nowTime: DateTime<Utc> = Utc::now();
        if nowTime.signed_duration_since(salestart).num_seconds() > 0
            && nowTime.signed_duration_since(salefinish).num_seconds() < 0
        {
            //POSTGRES
            let request_land = form.into_inner();
            if request_land.status ==1 || request_land.status==4
            {
                let client2: Client2 = db_pool.get().await.map_err(MyError::PoolError).unwrap();
                let _stmt = "UPDATE tiles SET status = ".to_string()
                    + &request_land.status.to_string()
                    + &" WHERE title = ".to_string()
                    + "\'"
                    + &request_land.title
                    + "\'"
                    + " RETURNING title,current_owner,price,district,status,group_id,token_id";
                let stmt = client2.prepare(&_stmt).await.unwrap();
                println!("{}", _stmt);
                let _result: Vec<Land> = Vec::new();
                let tempResult;
                let tempResult1 = client2.query(&stmt, &[]).await;
                if tempResult1.is_ok() {
                    tempResult = tempResult1
                        .ok()
                        .unwrap()
                        .iter()
                        .map(|row| Land::from_row_ref(row).unwrap())
                        .collect::<Vec<Land>>()
                        .pop()
                        .ok_or(MyError::NotFound);
    
                    if tempResult.is_ok() {
                        
                        Ok(HttpResponse::Ok().json(tempResult.ok().unwrap()))
                    } else {
                        Err(Error {
                            message: MyError::NotFound.to_string(),
                            status: 500,
                        })
                    }
                } else {
                    Err(Error {
                        message: "error in querying lands".to_string(),
                        status: 500,
                    })
                }
            }
            else{
                Err(Error {
                    message: "You're not allowed to buy these lands".to_string(),
                    status: 401,
                })
            }
            
        } else {
            Err(Error {
                message: "Not in sale time".into(),
                status: 401,
            })
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

//Transaction Requests
#[get("/get_transs")]
async fn get_transs(client: web::Data<Client>, id: Identity) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let collection: Collection<Transaction> = client.database(DB_NAME).collection(TRANS_COLL);
        match collection.find(None, None).await {
            Ok(mut cursor) => {
                let mut result: Vec<Transaction> = Vec::new();
                while cursor.advance().await.unwrap() {
                    result.push(cursor.deserialize_current().unwrap());
                }

                Ok(HttpResponse::Ok().json(result))
            }
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}
#[post("/add_trans")]
async fn add_trans(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<Transaction>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let collection = client.database(DB_NAME).collection(TRANS_COLL);
        let result = collection.insert_one(form.into_inner(), None).await;
        match result {
            Ok(_) => Ok(HttpResponse::Ok().body("trans added")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

/// Gets the user with the supplied username.
#[get("/get_trans/{tx_id}")]
async fn get_trans(
    client: web::Data<Client>,
    id: Identity,
    tx_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let tx_id = tx_id.into_inner();
        let collection: Collection<Transaction> = client.database(DB_NAME).collection(TRANS_COLL);
        match collection.find_one(doc! { "_id": &tx_id }, None).await {
            Ok(Some(trans)) => Ok(HttpResponse::Ok().json(trans)),
            Ok(None) => {
                Ok(HttpResponse::NotFound()
                    .body(format!("No transaction found with tx_id {}", tx_id)))
            }
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

//News Requests
#[get("/get_newss")]
async fn get_newss(client: web::Data<Client>, _id: Identity) -> HttpResponse {
    let collection: Collection<News> = client.database(DB_NAME).collection(NEWS_COLL);
    match collection.find(None, None).await {
        Ok(mut cursor) => {
            let mut result: Vec<News> = Vec::new();
            while cursor.advance().await.unwrap() {
                result.push(cursor.deserialize_current().unwrap());
            }

            HttpResponse::Ok().json(result)
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}
#[post("/add_news")]
async fn add_news(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<News>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let collection = client.database(DB_NAME).collection(NEWS_COLL);
        let result = collection.insert_one(form.into_inner(), None).await;
        match result {
            Ok(_) => Ok(HttpResponse::Ok().body("news added")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

#[get("/get_news/{news_id}")]
async fn get_news(
    client: web::Data<Client>,
    _id: Identity,
    news_id: web::Path<String>,
) -> HttpResponse {
    let news_id = news_id.into_inner();
    let collection: Collection<News> = client.database(DB_NAME).collection(NEWS_COLL);
    match collection.find_one(doc! { "_id": &news_id }, None).await {
        Ok(Some(news)) => HttpResponse::Ok().json(news),
        Ok(None) => {
            HttpResponse::NotFound().body(format!("No news found with news_id {}", news_id))
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}
#[get("/delete_news/{news_id}")]
async fn delete_news(
    client: web::Data<Client>,
    id: Identity,
    news_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let news_id = news_id.into_inner();
        let collection: Collection<News> = client.database(DB_NAME).collection(NEWS_COLL);
        match collection.delete_one(doc! { "_id": &news_id }, None).await {
            Ok(_) => Ok(HttpResponse::Ok().body("news deleted")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}
//Blogs Requests
#[get("/get_blogs")]
async fn get_blogs(client: web::Data<Client>, _id: Identity) -> HttpResponse {
    let collection: Collection<Blog> = client.database(DB_NAME).collection(BLOG_COLL);
    match collection.find(None, None).await {
        Ok(mut cursor) => {
            let mut result: Vec<Blog> = Vec::new();
            while cursor.advance().await.unwrap() {
                result.push(cursor.deserialize_current().unwrap());
            }

            HttpResponse::Ok().json(result)
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}
#[post("/add_blog")]
async fn add_blog(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<Blog>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let collection = client.database(DB_NAME).collection(BLOG_COLL);
        let result = collection.insert_one(form.into_inner(), None).await;
        match result {
            Ok(_) => Ok(HttpResponse::Ok().body("blog added")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

#[get("/get_blog/{blog_id}")]
async fn get_blog(
    client: web::Data<Client>,
    _id: Identity,
    blog_id: web::Path<String>,
) -> HttpResponse {
    let blog_id = blog_id.into_inner();
    let collection: Collection<Blog> = client.database(DB_NAME).collection(BLOG_COLL);
    match collection.find_one(doc! { "_id": &blog_id }, None).await {
        Ok(Some(blog)) => HttpResponse::Ok().json(blog),
        Ok(None) => {
            HttpResponse::NotFound().body(format!("No blogs found with blog_id {}", blog_id))
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/get_blog_cat/{cat_id}")]
async fn get_blog_cat(
    client: web::Data<Client>,
    _id: Identity,
    cat_id: web::Path<String>,
) -> HttpResponse {
    let cat_id = cat_id.into_inner();
    let collection: Collection<Blog> = client.database(DB_NAME).collection(BLOG_COLL);
    match collection
        .find_one(doc! { "cat": &cat_id.parse::<f32>().unwrap() }, None)
        .await
    {
        Ok(Some(blog)) => HttpResponse::Ok().json(blog),
        Ok(None) => HttpResponse::NotFound().body(format!("No blogs found with cat_id {}", cat_id)),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/delete_blog/{blog_id}")]
async fn delete_blog(
    client: web::Data<Client>,
    id: Identity,
    blog_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let blog_id = blog_id.into_inner();
        let collection: Collection<Blog> = client.database(DB_NAME).collection(BLOG_COLL);
        match collection.delete_one(doc! { "_id": &blog_id }, None).await {
            Ok(_) => Ok(HttpResponse::Ok().body("blog deleted")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}
#[post("/edit_blog/{blog_id}")]
async fn edit_blog(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<Blog>,
    blog_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let blog_id = blog_id.into_inner();
        let collection: Collection<Blog> = client.database(DB_NAME).collection(BLOG_COLL);
        let request_blog = form.into_inner();
        let doc = doc! {
            "title": request_blog.title,
            "content": request_blog.content,
            "image": request_blog.image,
            "date": request_blog.date,
            "cat": request_blog.cat,
        };
        match collection
            .update_one(doc! { "_id": blog_id }, doc, None)
            .await
        {
            Ok(_) => Ok(HttpResponse::Ok().body("blog edited")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

//Cats Requests
#[get("/get_cats")]
async fn get_cats(client: web::Data<Client>, id: Identity) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let collection: Collection<Cat> = client.database(DB_NAME).collection(CAT_COLL);
        match collection.find(None, None).await {
            Ok(mut cursor) => {
                let mut result: Vec<Cat> = Vec::new();
                while cursor.advance().await.unwrap() {
                    result.push(cursor.deserialize_current().unwrap());
                }

                Ok(HttpResponse::Ok().json(result))
            }
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}
#[post("/add_cat")]
async fn add_cat(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<Cat>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let collection = client.database(DB_NAME).collection(CAT_COLL);
        let result = collection.insert_one(form.into_inner(), None).await;
        match result {
            Ok(_) => Ok(HttpResponse::Ok().body("cat added")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

#[get("/get_cat/{cat_id}")]
async fn get_cat(
    client: web::Data<Client>,
    _id: Identity,
    cat_id: web::Path<String>,
) -> HttpResponse {
    let cat_id = cat_id.into_inner();
    let collection: Collection<Cat> = client.database(DB_NAME).collection(CAT_COLL);
    match collection.find_one(doc! { "_id": &cat_id }, None).await {
        Ok(Some(cat)) => HttpResponse::Ok().json(cat),
        Ok(None) => HttpResponse::NotFound().body(format!("No cats found with cat_id {}", cat_id)),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}
#[get("/delete_cat/{cat_id}")]
async fn delete_cat(
    client: web::Data<Client>,
    id: Identity,
    cat_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let cat_id = cat_id.into_inner();
        let collection: Collection<Cat> = client.database(DB_NAME).collection(CAT_COLL);
        match collection.delete_one(doc! { "_id": &cat_id }, None).await {
            Ok(_) => Ok(HttpResponse::Ok().body("cat deleted")),
            Err(err) => Err(Error {
                message: err.to_string(),
                status: 500,
            }),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}
#[get("/get_devices")]
async fn get_devices(client: web::Data<Client>, _id: Identity) -> HttpResponse {
    let collection: Collection<Device> = client.database(DB_NAME).collection(DEVICE_COLL);
    match collection.find(None, None).await {
        Ok(mut cursor) => {
            let mut result: Vec<Device> = Vec::new();
            while cursor.advance().await.unwrap() {
                result.push(cursor.deserialize_current().unwrap());
            }

            HttpResponse::Ok().json(result)
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}
#[post("/add_car")]
async fn add_car(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<Car>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let collection = client.database(DB_NAME).collection(CAR_COLL);
        let result = collection.insert_one(form.into_inner(), None).await;
        match result {
            Ok(_) => Ok(HttpResponse::Ok().body("car added")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

#[get("/get_car/{car_id}")]
async fn get_car(
    client: web::Data<Client>,
    _id: Identity,
    car_id: web::Path<String>,
) -> HttpResponse {
    let car_id = car_id.into_inner();
    let collection: Collection<Car> = client.database(DB_NAME).collection(CAR_COLL);
    match collection.find_one(doc! { "_id": &car_id }, None).await {
        Ok(Some(car)) => HttpResponse::Ok().json(car),
        Ok(None) => {
            HttpResponse::NotFound().body(format!("No cars found with car_id {}", car_id))
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}


#[get("/delete_car/{car_id}")]
async fn delete_car(
    client: web::Data<Client>,
    id: Identity,
    car_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let car_id = car_id.into_inner();
        let collection: Collection<Car> = client.database(DB_NAME).collection(CAR_COLL);
        match collection.delete_one(doc! { "_id": &car_id }, None).await {
            Ok(_) => Ok(HttpResponse::Ok().body("car deleted")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}
#[post("/edit_car/{car_id}")]
async fn edit_car(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<Car>,
    car_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let car_id = car_id.into_inner();
        let collection: Collection<Car> = client.database(DB_NAME).collection(CAR_COLL);
        let request_car = form.into_inner();
        let doc = doc! {
            "car_has_tracker":request_car.car_has_tracker,
            "car_name":request_car.car_name,
            "car_license_plate":request_car.car_license_plate,
            "car_vin":request_car.car_vin,
            "car_color":request_car.car_color,
            "car_typee":request_car.car_typee,
            "car_subtype":request_car.car_subtype,
            "car_model":request_car.car_model,
            "car_depot":request_car.car_depot,
            "car_tags":request_car.car_tags,
            "car_payload":request_car.car_payload,
            "car_cargo_cap":request_car.car_cargo_cap,
            "car_gross_weight":request_car.car_gross_weight,
            "car_passengers_cap":request_car.car_passengers_cap,
            "car_wheel_total":request_car.car_wheel_total,
            "car_wheel_drive":request_car.car_wheel_drive,
            "car_tire_size":request_car.car_tire_size,
            "car_tire_count":request_car.car_tire_count,
            "car_permitted_speed":request_car.car_permitted_speed,
            "car_chassis_number":request_car.car_chassis_number,
            "car_trailer":request_car.car_trailer,
            "car_manufacture_year":request_car.car_manufacture_year,
            "car_fuel_type":request_car.car_fuel_type,
            "car_fuel_grade":request_car.car_fuel_grade,
            "car_fuel_cost":request_car.car_fuel_cost,
            "car_tank_cap":request_car.car_tank_cap,
            "car_fuel_cons":request_car.car_fuel_cons,
            "car_ins_pol":request_car.car_ins_pol,
            "car_ins_valid":request_car.car_ins_valid,
            "car_ins2_pol":request_car.car_ins2_pol,
            "car_ins2_valid":request_car.car_ins2_valid,
            "car_driver_name":request_car.car_driver_name,
            "car_driver_number":request_car.car_driver_number,
            "car_al":request_car.car_al,
            "car_org":request_car.car_org,
            "car_device_id":request_car.car_device_id,
        };
        match collection
            .update_one(doc! { "_id": car_id }, doc, None)
            .await
        {
            Ok(_) => Ok(HttpResponse::Ok().body("car edited")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

#[get("/get_cars")]
async fn get_cars(client: web::Data<Client>, _id: Identity) -> HttpResponse {
    let collection: Collection<Car> = client.database(DB_NAME).collection(CAR_COLL);
    match collection.find(None, None).await {
        Ok(mut cursor) => {
            let mut result: Vec<Car> = Vec::new();
            while cursor.advance().await.unwrap() {
                result.push(cursor.deserialize_current().unwrap());
            }

            HttpResponse::Ok().json(result)
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}
#[post("/add_device")]
async fn add_device(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<Device>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let collection = client.database(DB_NAME).collection(DEVICE_COLL);
        let result = collection.insert_one(form.into_inner(), None).await;
        match result {
            Ok(_) => Ok(HttpResponse::Ok().body("device added")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

#[get("/get_device/{device_id}")]
async fn get_device(
    client: web::Data<Client>,
    _id: Identity,
    device_id: web::Path<String>,
) -> HttpResponse {
    let device_id = device_id.into_inner();
    let collection: Collection<Device> = client.database(DB_NAME).collection(DEVICE_COLL);
    match collection.find_one(doc! { "_id": &device_id }, None).await {
        Ok(Some(device)) => HttpResponse::Ok().json(device),
        Ok(None) => {
            HttpResponse::NotFound().body(format!("No devices found with device_id {}", device_id))
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}


#[get("/delete_device/{device_id}")]
async fn delete_device(
    client: web::Data<Client>,
    id: Identity,
    device_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let device_id = device_id.into_inner();
        let collection: Collection<Device> = client.database(DB_NAME).collection(DEVICE_COLL);
        match collection.delete_one(doc! { "_id": &device_id }, None).await {
            Ok(_) => Ok(HttpResponse::Ok().body("device deleted")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}
#[post("/edit_device/{device_id}")]
async fn edit_device(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<Device>,
    device_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let device_id = device_id.into_inner();
        let collection: Collection<Device> = client.database(DB_NAME).collection(DEVICE_COLL);
        let request_device = form.into_inner();
        let doc = doc! {
            "device_expire_account": request_device.device_expire_account,
            "device_id": request_device.device_id,
            "device_number": request_device.device_number,
            "device_owner_name": request_device.device_owner_name,
            "device_owner_number": request_device.device_owner_number,
        };
        match collection
            .update_one(doc! { "_id": device_id }, doc, None)
            .await
        {
            Ok(_) => Ok(HttpResponse::Ok().body("device edited")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}



#[post("/add_report")]
async fn add_report(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<Report>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let collection = client.database(DB_NAME).collection(REPORT_COLL);
        let result = collection.insert_one(form.into_inner(), None).await;
        match result {
            Ok(_) => Ok(HttpResponse::Ok().body("report added")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}

#[get("/get_report/{report_id}")]
async fn get_report(
    client: web::Data<Client>,
    _id: Identity,
    report_id: web::Path<String>,
) -> HttpResponse {
    let report_id = report_id.into_inner();
    let collection: Collection<Report> = client.database(DB_NAME).collection(REPORT_COLL);
    match collection.find_one(doc! { "_id": &report_id }, None).await {
        Ok(Some(report)) => HttpResponse::Ok().json(report),
        Ok(None) => {
            HttpResponse::NotFound().body(format!("No reports found with report_id {}", report_id))
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}


#[get("/delete_report/{report_id}")]
async fn delete_report(
    client: web::Data<Client>,
    id: Identity,
    report_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let report_id = report_id.into_inner();
        let collection: Collection<Report> = client.database(DB_NAME).collection(REPORT_COLL);
        match collection.delete_one(doc! { "_id": &report_id }, None).await {
            Ok(_) => Ok(HttpResponse::Ok().body("report deleted")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}
#[post("/edit_report/{report_id}")]
async fn edit_report(
    client: web::Data<Client>,
    id: Identity,
    form: web::Json<Report>,
    report_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    if let _user_id = id.id().unwrap() {
        let report_id = report_id.into_inner();
        let collection: Collection<Report> = client.database(DB_NAME).collection(REPORT_COLL);
        let request_report = form.into_inner();
        let doc = doc! {
            "report_address": request_report.report_address,
            "report_delivery": request_report.report_delivery,
            "report_img": request_report.report_img,
            "report_name": request_report.report_name,
            "report_position": request_report.report_position,
            "report_type": request_report.report_type,
            "report_usage_type": request_report.report_usage_type,
        };
        match collection
            .update_one(doc! { "_id": report_id }, doc, None)
            .await
        {
            Ok(_) => Ok(HttpResponse::Ok().body("report edited")),
            Err(err) => Ok(HttpResponse::InternalServerError().body(err.to_string())),
        }
    } else {
        println!("[article] user_id: (none)");
        Err(Error {
            message: "Need auth".into(),
            status: 401,
        })
    }
}
#[get("/get_reports")]
async fn get_reports(client: web::Data<Client>, _id: Identity) -> HttpResponse {
    let collection: Collection<Report> = client.database(DB_NAME).collection(CAR_COLL);
    match collection.find(None, None).await {
        Ok(mut cursor) => {
            let mut result: Vec<Report> = Vec::new();
            while cursor.advance().await.unwrap() {
                result.push(cursor.deserialize_current().unwrap());
            }

            HttpResponse::Ok().json(result)
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}
struct captcha_data {
    uids: Vec<u32>,
    uimgs: Vec<u32>,
}
//Main function
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let secret_key = Key::generate();
    let redis_connection_string = "127.0.0.1:6379";

    dotenv().ok();

    let count: usize = 3;
    let mut imgs: Vec<image::DynamicImage> = Vec::new();
    


    for ii in 0..count {
        println!("I{}.jpg", ii + 1);
        imgs.push(image::open(format!("I{}.jpg", ii + 1)).unwrap());
    }

    let uri = std::env::var("MONGODB_URI").unwrap_or_else(|_| {
        "mongodb://atlasavlclient:atlasavl89GC144@127.0.0.1:27017/atlasavl?authSource=admin"
            .into()
    });
    let client = Client::with_uri_str(uri).await.expect("failed to connect");
/////
    // let config_ = Config::builder()
    //     .add_source(::config::Environment::default())
    //     .build()
    //     .unwrap();
    // let config2: ExampleConfig = config_.try_deserialize().unwrap();
    // let pool = config2.pg.create_pool(None, NoTls).unwrap();


    let localhost_v4 = IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1));

    let mut pg_config = tokio_postgres::Config::new();
    pg_config.hostaddr(localhost_v4);
    pg_config.host("/usr/local/pgsql");
    pg_config.user("postgres");
    pg_config.dbname("atlasavl");
    pg_config.password("Rahnegar1231091256");
    pg_config.port(5432);
    let mgr_config = ManagerConfig {
        recycling_method: RecyclingMethod::Fast
    };
    let mgr = Manager::from_config(pg_config, NoTls, mgr_config);
    let pool = Pool::builder(mgr).max_size(16).build().unwrap();

/////
    let _private_key = rand::thread_rng().gen::<[u8; 32]>();
    create_username_index(&client).await;
    // let mut builder = SslAcceptor::mozilla_intermediate(SslMethod::tls()).unwrap();
    // builder
    //     .set_private_key_file("/etc/letsencrypt/live/teh.land/privkey.pem", SslFiletype::PEM)
    //     .unwrap();
    // builder.set_certificate_chain_file("/etc/letsencrypt/live/teh.land/fullchain.pem").unwrap();

    let restClient = reqwest::Client::new();
    let mut initialData = captcha_data { uids: Vec::new(),uimgs: Vec::new() };
    initialData.uids.push(11111111);
    initialData.uimgs.push(11111111);

    let data = Data::new(Mutex::new(initialData));


    HttpServer::new(move || {


        App::new()
            .wrap(IdentityMiddleware::default())
            // The identity system is built on top of sessions. You must install the session
            // middleware to leverage `actix-identity`. The session middleware must be mounted
            // AFTER the identity middleware: `actix-web` invokes middleware in the OPPOSITE
            // order of registration when it receives an incoming request.
            .wrap(
                SessionMiddleware::new(
                    RedisActorSessionStore::new(redis_connection_string),
                    secret_key.clone()
                )
            )
            .app_data(web::Data::new(restClient.clone()))
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(client.clone()))
            .app_data(web::Data::new(imgs.clone()))
            .app_data(Data::clone(&data))
            .service(add_user)
            .service(get_user)
            .service(login_user)
            .service(logout_user)
            .service(delete_user)
            .service(add_land)
            .service(get_land)
            .service(query_lands)
            .service(add_trans)
            .service(get_trans)
            .service(add_news)
            .service(get_news)
            .service(delete_news)
            .service(add_blog)
            .service(get_blog)
            .service(delete_blog)
            .service(edit_blog)
            .service(get_blogs)
            .service(get_cats)
            .service(delete_cat)
            .service(add_cat)
            .service(get_newss)
            .service(get_transs)
            .service(get_users)
            .service(get_lands)
            .service(get_sale_time)
            .service(get_land_group)
            .service(captcha)
            .service(captcha_verification)
            .service(transfer_land)
            .service(sell_land)
            .service(add_car)
            .service(get_car)
            .service(delete_car)
            .service(edit_car)
            .service(get_cars)
            .service(add_device)
            .service(get_device)
            .service(delete_device)
            .service(edit_device)
            .service(get_devices)
            .service(add_report)
            .service(get_report)
            .service(delete_report)
            .service(edit_report)
            .service(get_reports)
    })
    .bind(("127.0.0.1", 8086))?
    // .bind_openssl("127.0.0.1:8086", builder)?    
    .run()
    .await
}


/// Creates an index on the "username" field to force the values to be unique.
async fn create_username_index(client: &Client) {
    let options = IndexOptions::builder().unique(true).build();
    let model = IndexModel::builder()
        .keys(doc! { "email": 1 })
        .options(options)
        .build();
    client
        .database(DB_NAME)
        .collection::<User>(USER_COLL)
        .create_index(model, None)
        .await
        .expect("creating an index should succeed");
}

async fn check_user(client: &Client, field: &str, fval: &str) -> bool {
    let collection: Collection<User> = client.database(DB_NAME).collection(USER_COLL);
    let query = doc! {
        field: fval,
    };
    match collection.find(query, None).await {
        Ok(mut cursor) => {
            let mut result: Vec<User> = Vec::new();
            while cursor.advance().await.unwrap() {
                result.push(cursor.deserialize_current().unwrap());
            }
            if result.len() > 0 {
                return true;
            } else {
                return false;
            }
        }
        Err(_) => return false,
    }
}
