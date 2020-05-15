// import { Modal } from 'iview'
import {
  MessageBox
} from 'element-ui';
const beforeClose = {
  before_close_normal: (resolve) => {
    // Modal.confirm({
    //   title: '确定要关闭这一页吗',
    //   onOk: () => {
    //     resolve(true)
    //   },
    //   onCancel: () => {
    //     resolve(false)
    //   }
    // })
    this.$confirm('确定要关闭这一页吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      resolve(true)
    }).catch(() => {
      resolve(false)
    });
  }
}

export default beforeClose
