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
use std::net::IpAddr;

#[derive(Database)]
#[database("analytics")]
struct Analytics(SqlitePool);

#[get("/visit")]
async fn visit(mut db: Connection<Analytics>, ip: IpAddr) {
    println!("New visit: {}", ip);

    match get_visitor_id(&mut db, ip).await {
        None => {
            match sqlx::query(
                "INSERT
                INTO visitors(ip)
                VALUES (?);",
            )
            .bind(ip.to_string())
            .execute(&mut *db)
            .await
            {
                Ok(_) => {
                    let id = get_visitor_id(&mut db, ip).await.unwrap_or_default();
                    insert_visit(&mut db, id).await
                }
                Err(err) => println!("Error inserting new visitor: {}", err),
            }
        }
        Some(id) => insert_visit(&mut db, id).await,
    }
}

async fn get_visitor_id(db: &mut Connection<Analytics>, ip: IpAddr) -> Option<i64> {
    match sqlx::query(
        "SELECT *
            FROM visitors
            WHERE ip = ?
            LIMIT 0,1;",
    )
    .bind(ip.to_string())
    .fetch_one(&mut **db)
    .await
    {
        Ok(row) => Some(row.try_get::<i64, usize>(0).unwrap_or_default()),
        Err(err) => {
            println!(
                "Error getting visitor id (may be on purpose if visitor does not yet exist): {}",
                err
            );
            None
        }
    }
}

async fn insert_visit(db: &mut Connection<Analytics>, id: i64) {
    if let Err(err) = sqlx::query(
        "INSERT
            INTO visits(visitor_id)
            VALUES (?);",
    )
    .bind(id)
    .execute(&mut **db)
    .await
    {
        println!("Error inserting new visit: {}", err);
    }
}

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
        .mount("/", routes![visit, analytics])
}
