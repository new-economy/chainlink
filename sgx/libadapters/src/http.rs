use libc;
use sgx_types::*;
use std::ptr;

use ENCLAVE;

extern {
    fn sgx_http_get(eid: sgx_enclave_id_t,
                    retval: *mut sgx_status_t,
                    url: *const u8) -> sgx_status_t;
    fn sgx_http_post(eid: sgx_enclave_id_t,
                     retval: *mut sgx_status_t,
                     url: *const u8,
                     body: *const u8) -> sgx_status_t;
}

#[no_mangle]
pub extern "C" fn http_get(url: *const libc::c_char) -> *const libc::c_char {
    let mut retval = sgx_status_t::SGX_SUCCESS;
    unsafe { sgx_http_get(ENCLAVE.geteid(), &mut retval, url as *const u8); }
    ptr::null()
}

#[no_mangle]
pub extern "C" fn http_post(url: *const libc::c_char, body: *const libc::c_char) -> *const libc::c_char {
    let mut retval = sgx_status_t::SGX_SUCCESS;
    unsafe { sgx_http_post(ENCLAVE.geteid(), &mut retval, url as *const u8, body as *const u8); }
    ptr::null()
}
