use rocket::{
    fs::{relative, FileServer},
    get, routes,
    serde::json::Json,
};
use rocket_db_pools::{
    sqlx::{self, Row, SqlitePool},
    Connection, Database,
};
use serde::Serialize;

#[derive(Database)]
#[database("analytics")]
struct Analytics(SqlitePool);

#[derive(Serialize)]
struct Visit {
    ip: String,
    time: String,
}

#[get("/analytics")]
async fn analytics(mut db: Connection<Analytics>) -> Json<Vec<Visit>> {
    Json(
        sqlx::query(
            "SELECT ip, strftime('%s', time) as time
            FROM visits
            INNER JOIN visitors ON visitors.id = visitor_id;",
        )
        .fetch_all(&mut *db)
        .await
        .unwrap_or_default()
        .into_iter()
        .map(|r| Visit {
            ip: r.try_get(0).unwrap_or_default(),
            time: r.try_get(1).unwrap_or_default(),
        })
        .collect(),
    )
}

#[rocket::launch]
fn rocket() -> _ {
    rocket::build()
        .attach(Analytics::init())
        .mount("/", FileServer::from(relative!("public")))
        .mount("/", routes![analytics])
}
