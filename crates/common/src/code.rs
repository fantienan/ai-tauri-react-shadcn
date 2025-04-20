use std::path::PathBuf;
use archflow::compress::tokio::archive::ZipArchive;
use archflow::compress::FileOptions;
use archflow::compression::CompressionMethod;
use tokio::io::{duplex, DuplexStream};
use tokio_util::io::ReaderStream;
use walkdir::WalkDir;

pub async fn download( src_dir: &PathBuf) -> Result<ReaderStream<DuplexStream>, String> {
    if !src_dir.exists() {
        return Err(format!("模板目录不存在: {:?}", src_dir));
    } 

    // 1. 创建内存双工管道
    let (writer, reader) = duplex(16 * 1024);  // 16 KB 缓冲&#8203;:contentReference[oaicite:12]{index=12}

    // Clone the path for ownership in the spawned task
    let owned_src_dir = src_dir.clone();

    // 2. 后台任务：动态遍历目录并压缩写入 writer
    tokio::spawn(async move {
        let mut archive = ZipArchive::new_streamable(writer);
        let options = FileOptions::default()
            .compression_method(CompressionMethod::Deflate());

        for entry in WalkDir::new(&owned_src_dir)
            .into_iter()
            .filter_map(Result::ok)
            .filter(|e| e.path().is_file())
        {
            let rel = entry.path().strip_prefix(&owned_src_dir).unwrap().to_str().unwrap();
            let mut f = tokio::fs::File::open(entry.path()).await.unwrap();
            archive.append(rel, &options, &mut f).await.unwrap();
        }
        archive.finalize().await.unwrap();
    });

    // 3. 将 reader 转流并返回 HTTP 响应
    let stream = ReaderStream::new(reader);
    Ok(stream)
}
