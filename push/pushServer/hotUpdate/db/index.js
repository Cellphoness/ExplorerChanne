var sqlite3 = require('sqlite3').verbose();

const APP = 'app'
const VERSION = 'version'
const BUNDLE = 'bundle'

var db = new sqlite3.Database("./hotUpdate/db/mydatebase.db");

db.serialize(function() {
	var sql1 = 'create table if not exists ' + APP + ' (appId text primary key, name text, platform text, downloadUrl text)';
	db.run(sql1);
	var sql2 = 'create table if not exists ' + VERSION + ' (versionId text primary key, appId text, version text, hash text, expired boolean)';
	db.run(sql2);
	//ver {updateDiff, updateDiffSize,} 
	db.run('DROP TABLE bundle')
	var sql3 = 'create table if not exists ' + BUNDLE + ' (hash text primary key, appId text, name text unique, packageVerMapDiff text, metaInfo text, ppkUrl text)';
	db.run(sql3);
});
// db.close();

/*

接口列表
create packageVersion
versions （查看所有版本）(get)
publish (bind packageVersion)
upload (ppk)
update
本地实现 生成 hash和对应的bundlejs


app 表 
列表id(序号) name  appId(name的MD5)  platform (iOS/android)  downloadUrl 

version 表  (expired手动设置 单选(同一个appId)）
appId(name的MD5) version(key) hash expired

bundle 表（只有metaInfo, updateDiff 可变） 
appId(name的MD5) name(unique) hash metaInfo updateDiff(url) updateDiffSize(KB/MB) ppkUrl packageVersion

*/

const dbUtil = {
   
	//TODO 数据库操作
		
	//Version
	createVersion : (versionId, appId, version, then, hash='unknown', expired=false) => {
		db.run("insert into version values(?, ?, ?, ?, ?)", [versionId, appId, version, hash, expired], (err) => {
			if (err) {
				then({val:false, msg:err})
			} else {
			    then({val:true})
			}
		});
	},
	queryVersionByAppid : (appId, then) => {
		db.all('select rowid as id, versionId, appId, version, hash, expired from version where appId = ? order by rowid desc', [appId], (err, rows) => {
			if (err) {
				then({val:false, data:err})
			} else {
				then({val:true, data:{list:rows}})
			}
		})
	},
	existsByVersionId : (versionId, then) => {
		db.all('select versionId from version where versionId = ?', [versionId], (err, rows) => {
			let count = rows.length
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true, count})
			}
		})
	},
	deleteByVersionId : (versionId, then)=> {
		db.run('delete from version where versionId = ?', [versionId], err => {
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true})
			}
		})
	},
	updateHashByVersionId: (versionId, hash, then) => {
		db.run('update version set hash = ? where versionId = ?', [hash, versionId], err => {
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true})
			}
		})
	},
	updateExpiredByVersionId: (versionId, expired, then) => {
		db.run('update version set expired = ? where versionId = ?', [expired, versionId], err => {
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true})
			}
		})
	},


    //App
    insertApp : (appId, name, platform, downloadUrl, then) => {
        db.run("insert into app values(?, ?, ?, ?)", [appId, name, platform, downloadUrl], (err) => {
			if (err) {
				then({val:false, msg:err})
			} else {
				db.all('select rowid as id from app where appId = ?', [appId], (err, rows) => {
					if (rows.count !== 0) {
						var id = rows[0].id
						then({val:true, id})
					}
				})
				
			}
		});
	
	// var stmt = db.prepare('insert into ' + APP + ' values(?, ?, ?, ?)')
	// db.run("BEGIN TRANSACTION",);
	// stmt.run(appId, name, platform, downloadUrl, (err) => {
	// 	if (err) {
	// 		then({val:false, msg:err})
	// 	} 
	// });
	// db.run("COMMIT TRANSACTION", null, (err) => {
	// 	if (err) {
	// 	} else {
	// 	    then({val:true})
	// 	}
	// });		 
   },
   deleteByAppId : (appId, then) => {
		db.run('delete from app where appId = ?', [appId], err => {
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true})
			}
		})
	},
	queryApp : (then) => {
		db.all('select rowid as id, appId, name, platform, downloadUrl from app order by rowid desc', (err, rows) => {
			if (err) {
				then({val:false, data:err})
			} else {
				then({val:true, data:{list:rows}})
			}
		})
	},
	queryById : (id, then) => {
		db.all('select rowid as id, appId, name, platform, downloadUrl from app where rowid = ? order by rowid desc', [id], (err, rows) => {
			if (err) {
				then({val:false, data:err})
			} else {
				if (rows.length !== 0) {
					then({val:true, data:rows[0]})
				} else {
					then({val:false, data:'Not find'})
				}
			}
		})
	},
	queryByPlatform : (platform, then) => {
		db.all('select rowid as id, appId, name, platform, downloadUrl from app where platform = ? order by rowid desc', [platform], (err, rows) => {
			if (err) {
				then({val:false, data:err})
			} else {
				then({val:true, data:{list:rows}})
			}
		})
	},
	existsByAppId : (appId, then) => {
		db.all('select appId from app where appId = ?', [appId], (err, rows) => {
			let count = rows.length
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true, count})
			}
		})
	},
	updateAppInfo : (appId, downloadUrl, then) => {
		db.run('update app set downloadUrl = ? where appId = ?', [downloadUrl, appId], err => {
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true})
			}
		})
	},
}

module.exports = dbUtil