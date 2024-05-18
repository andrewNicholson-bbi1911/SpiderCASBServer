const path = require("path");
const fs = require("fs");
const { json } = require("body-parser");
const MainStorageDirectory = require("../../../redmine_config").StorageFolder;

class FileManager{

    static tryUploadFileByFullPAthSync(dir_path, file_Data, file_name){
        //гарантирую, что файл есть и он соответствует требованиям

        if(!fs.existsSync(dir_path)){
            fs.mkdirSync(dir_path);
        }

        const file_path = path.join(dir_path, file_name);

        if(fs.existsSync(file_path)){
            fs.unlinkSync(file_path);
        }
        const file = fs.writeFileSync(file_path, file_Data);
        const fileData = new FileData(dir_path, FileCreator.getLinkFromFullPath(file_path), file_name );
        return fileData;
    }

    static tryUploadFileSync(storage_directory, file_Data, file_name){
        //гарантирую, что файл есть и он соответствует требованиям
       
        const dir_path = path.join(MainStorageDirectory, storage_directory);
        return FileCreator.tryUploadFileByFullPAthSync(dir_path, file_Data, file_name);

        if(fs.existsSync(filepath)){
            fs.unlinkSync(filepath);
        }


        //const res = await file_Data.mv(filepath, (err) => {
        //        if (err) return null;
        //        const fileData = new FileData(MainStorageDirectory, path.join(storage_directory, file_Data.name), file_Data.name );
        //        next(fileData)
        //    })
        
        const file = fs.writeFileSync(filepath, file_Data);
        const fileData = new FileData(MainStorageDirectory, path.join(storage_directory, file_name), file_name );
        return fileData;
    }

    static getFullFilePath(file_link){
        const filePath = path.join(MainStorageDirectory, file_link);
        return filePath;
    }

    static getLinkFromFullPath(file_path){
        console.log(file_path)
        return path.relative(MainStorageDirectory, file_path);
    }

    static getAmountOfFilesInPath(full_file_path){
        return fs.readdirSync(full_file_path).length;
    }

    static getAmountOfFilesInStorageDir(dir_path){
        const full_path = path.join(MainStorageDirectory, dir_path);
        return fs.readdirSync(full_path).length;
    }

    static createDirectory(target_path, new_directory){
        fs.mkdirSync(path.join(target_path, new_directory));
    }

    static updateStrStorageFileSync(dir_path, file_name, data_str){
        //гарантирую, что файл есть
        const full_path = path.join(MainStorageDirectory, dir_path, file_name);
        fs.writeFileSync(full_path, data_str, {encoding: 'utf-8'});
    }

    
    static readStrFileSync(dir_path, file_name){
        const full_path =path.join(MainStorageDirectory, dir_path, file_name);
        return fs.readFileSync(full_path, {encoding: 'utf-8'});
    }
/* не работает
    static async readStrFileAsync(dir_path, file_name){
        const full_path =path.join(MainStorageDirectory, dir_path, file_name);
        const promis = new Promise((res, rej) => {
            fs.readFile(full_path, {encoding: 'utf-8'}, (err, data) => {
                if(err){
                    rej(err);
                }
                res(data);
            });
        });
        const str = await promis;
        return str;
    }
    */
/*

    static getFileStrByID(full_dir_path, index){
        const file = fs.readdirSync(full_dir_path)[index];
        const file_path = path.join(full_dir_path, file);
        const fileData = fs.readFileSync(file_path, {encoding: 'utf-8'});
        return fileData;
    }
    */
}

class FileData{
    constructor(storage_directory, file_link, file_name ){
        this.storage_directory = storage_directory;
        this.file_link = file_link;
        this.file_name = file_name;
    }
}

module.exports = FileManager;