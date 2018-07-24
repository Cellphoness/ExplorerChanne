const { Client } = require('pg')
const { psqlUrl } = require('../constant')
const connectionString = psqlUrl
var client = new Client({
	connectionString,
})
client.connect()
client.query(
	`
	create table if not exists app(
		id serial,
		"appId" text, 
		name text, 
		platform text, 
		"downloadUrl" text, 
		PRIMARY KEY("appId")
	);

	create table if not exists version(
		id serial,
		"versionId" text, 
		"appId" text, 
		version text, 
		hash text, 
		expired boolean,
		PRIMARY KEY("versionId")
	);

	create table if not exists bundle(
		id serial,
		hash text, 
		"appId" text, 
		name text, 
		"packageVerMapDiff" text, 
		"metaInfo" text, 
		"ppkUrl" text, 
		description text, 
		platform text,
		UNIQUE(name),
		PRIMARY KEY(hash)
	);

	create table if not exists user_update(
		id serial,
		name text, 
		email text, 
		password text,
		PRIMARY KEY(email)
	);

	create table if not exists file(
		id serial,
		hash text, 
		data text, 
		PRIMARY KEY(hash)
	);
	`
)

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

	//User
	existUser: (email) => {
		return new Promise((resolve, reject) => {
			client.query("select * from user_update where email = $1", [email], (err, res) => {
				if (err) {
					reject(err)
				} else {
					resolve(res.rows)
				}
			})
		})
	},
	
	createUser: (name, email, password) => {
		return client.query("insert into user_update (name, email, password) values($1, $2, $3)", [name, email, password])
	},

	//Bundle
	createBundle: (hash, appId, name, metaInfo='', packageVerMapDiff='', ppkUrl, description, platform) => {
		return new Promise((resolve, reject) => {
			client.query('insert into bundle (hash, "appId", name, "packageVerMapDiff", "metaInfo", "ppkUrl", description, platform) values($1, $2, $3, $4, $5, $6, $7, $8)', [hash, appId, name, packageVerMapDiff, metaInfo, ppkUrl, description, platform], (err) => {
				if (err) {
					reject(err)
				} else {
					client.query('select * from bundle where hash = $1', [hash], (err, {rows}) => {
						if (rows.length !== 0) {
							var id = rows[0].id
							resolve({id})
						}
					})
				}
			});
		})
	},
	clearBundleByVersion: (appId, version) => {
		return new Promise((resolve, reject) => {
			client.query(`select * from bundle where "appId" = $1 and "packageVerMapDiff" like $2`, [appId, `%\"${version}\"%`], (err, {rows}) => {
				if (err) {
					reject(err)
				} else {
					rows.forEach(e => {
						let packagesObj = {
							...JSON.parse(e.packageVerMapDiff),
						}
						delete packagesObj[`${version}`] 
						let packages = JSON.stringify(packagesObj);
						client.query('update bundle set "packageVerMapDiff" = $1 where hash = $2', [packages, e.hash],  (err) => {
							if (err) {
								reject(err)
							}
						})
					});
					resolve();
				}
			})
		})
	},
	deleteBundleByAppId: (appId) => {
		return new Promise((resolve, reject) => {
			client.query(`delete from bundle where "appId" = $1`, [appId], err => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	},
	deleteBundleByHash: (hash) => {
		return new Promise((resolve, reject) => {
			client.query(`delete from bundle where hash = $1`, [hash], err => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	},
	queryBundleByHash: (hash) => {
		return new Promise((resolve, reject) => {
			client.query(`select * from bundle where hash = $1`, [hash], (err, {rows}) => {
				if (err) {
					reject(err)
				} else {
					if (rows.length) {
						let bundle = rows[0];
						resolve({
							...bundle,
							packages:JSON.parse(bundle.packageVerMapDiff)
						})
					} else {
						reject('not exist')
					}
				}
			})
		})
	},
	queryBundleByVersion: (appId, version) => {
		return new Promise((resolve, reject) => {
			if (version) {
				client.query(`select * from bundle where "appId" = $1 and "packageVerMapDiff" like $2 order by id desc`, [appId, `%\"${version}\"%`], (err, {rows}) => {
					if (err) {
						reject(err)
					} else {
						resolve({
							data:{
								list:rows.map((e) => {
									return {
										...e,
										packages:JSON.parse(e.packageVerMapDiff)
									}
								})
							}
						})
					}
				})
			} else {
				client.query('select * from bundle where "appId" = $1 order by id desc', [appId], (err, {rows}) => {
					if (err) {
						reject(err)
					} else {
						resolve({
							data:{
								list:rows.map((e) => {
									return {
										...e,
										packages:JSON.parse(e.packageVerMapDiff)
									}
								})
							}
						})
					}
				})
			}
		})
	},
	updateBundle: (hash, packages) => {
		return client.query('update bundle set "packageVerMapDiff" = $1 where hash = $2', [packages, hash])
	},
	
	//Version
	createVersion : (versionId, appId, version, then, hash='unknown', expired=false) => {
		client.query(`insert into version ("versionId", "appId", version, hash, expired) values($1, $2, $3, $4, $5)`, [versionId, appId, version, hash, expired], (err) => {
			if (err) {
				then({val:false, msg:err})
			} else {
				client.query('select * from version where "versionId" = $1', [versionId], (err, {rows}) => {
					if (rows.length !== 0) {
						var id = rows[0].id
						then({val:true, id})
					}
				})
			}
		});
	},
	queryVersion : (then) => {
		client.query('select * from version order by id desc', (err, {rows}) => {
			if (err) {
				then({val:false, data:err})
			} else {
				then({val:true, data:{list:rows}})
			}
		})
	},
	queryVersionByAppid : (appId, then) => {
		client.query('select * from version where "appId" = $1 order by id desc', [appId], (err, {rows}) => {
			if (err) {
				then({val:false, data:err})
			} else {
				then({val:true, data:{list:rows}})
			}
		})
	},
	existsByVersionId : (versionId, then) => {
		client.query('select * from version where "versionId" = $1', [versionId], (err, {rows}) => {
			let count = rows.length
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true, count})
			}
		})
	},
	deleteVersionByAppId : (appId, then) => {
		client.query('delete from version where "appId" = $1', [appId], err => {
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true})
			}
		})
	},
	deleteByVersionId : (versionId, then)=> {
		client.query('delete from version where "versionId" = $1', [versionId], err => {
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true})
			}
		})
	},
	updateHashByVersionId: (versionId, hash) => {
		return new Promise((resolve, reject) => {
			client.query('update version set hash = $1 where "versionId" = $2', [hash, versionId], err => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		});
	},
	updateExpiredByVersionId: (versionId, expired, then) => {
		client.query('update version set expired = $1 where "versionId" = $2', [expired, versionId], err => {
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true})
			}
		})
	},


    //App
    insertApp : (appId, name, platform, downloadUrl, then) => {
        client.query('insert into app ("appId", name, platform, "downloadUrl") values($1, $2, $3, $4)', [appId, name, platform, downloadUrl], (err) => {
			if (err) {
				then({val:false, msg:err})
			} else {
				client.query('select * from app where "appId" = $1', [appId], (err, {rows}) => {
					if (rows.length !== 0) {
						var id = rows[0].id
						then({val:true, id})
					}
				})
			}
		})
   },
   deleteByAppId : (appId, then) => {
		client.query('delete from app where "appId" = $1', [appId], err => {
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true})
			}
		})
	},
	queryApp : (then) => {
		client.query('select * from app order by id desc', (err, {rows}) => {
			if (err) {
				then({val:false, data:err})
			} else {
				then({val:true, data:{list:rows}})
			}
		})
	},
	queryById : (id, then) => {
		client.query('select * from app where id = $1 order by id desc', [id], (err, {rows}) => {
			if (err) {
				then({val:false, data:err})
			} else {
				if (rows.length !== 0) {
					then({val:true, app:rows[0]})
				} else {
					then({val:false, app:'Not find'})
				}
			}
		})
	},
	queryByPlatform : (platform, then) => {
		client.query('select * from app where platform = $1 order by id desc', [platform], (err, {rows}) => {
			if (err) {
				then({val:false, data:err})
			} else {
				then({val:true, data:{list:rows}})
			}
		})
	},
	existsByAppId : (appId, then) => {
		client.query('select * from app where "appId" = $1', [appId], (err, {rows}) => {
			let count = rows.length
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true, count})
			}
		})
	},
	updateAppInfo : (appId, downloadUrl, then) => {
		client.query('update app set "downloadUrl" = $1 where "appId" = $2', [downloadUrl, appId], err => {
			if (err) {
				then({val:false, msg:err})
			} else {
				then({val:true})
			}
		})
	},

	saveToFile : (key, data) => {
		return client.query('insert into file (hash, data) values($1, $2)', [key, data])
	},

	readFormKey : (key) => {
		return client.query('select * from file where hash = $1', [key])
	},
	deleteFormKey : (key) => {
		return client.query('delete from file where hash = $1', [key])
	},
	updateFormKey : (key, data) => {
		return client.query('update file set data = $1 where hash = $2', [data, key])
	}
}

module.exports = dbUtil