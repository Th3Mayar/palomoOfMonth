import { ref, reactive } from 'vue';
import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '~/types/employee';
import { EmployeeService } from '~/services/employee/employeeService';

export const useEmployees = () => {
  const employees = ref<Employee[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const employeeService = EmployeeService.getInstance();
  const { showSuccess, showError } = useAlert();

  // Reactive state for modal management
  const modalState = reactive({
    isCreateModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    selectedEmployee: null as Employee | null,
  });

  // Form state
  const formState = reactive({
    name: '',
    imageBytes: '',
    imageFile: null as File | null,
    isSubmitting: false,
  });

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      loading.value = true;
      error.value = null;
      console.log('🔍 Fetching employees...');
      const fetchedEmployees = await employeeService.getAllEmployees();
      console.log('✅ Employees fetched from service:', fetchedEmployees);
      employees.value = fetchedEmployees;
      console.log('📝 Employees assigned to reactive ref:', employees.value);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch employees';
      console.error('❌ Error fetching employees:', err);
    } finally {
      loading.value = false;
    }
  };

  // Create new employee
  const createEmployee = async (employeeData: CreateEmployeeRequest) => {
    try {
      formState.isSubmitting = true;
      error.value = null;
      
      const newEmployee = await employeeService.createEmployee(employeeData);
      employees.value.push(newEmployee);
      closeCreateModal();
      showSuccess('Success!', 'Employee created successfully');
      
      return { success: true, data: newEmployee };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create employee';
      showError('Error', error.value);
      console.error('Error creating employee:', err);
      return { success: false, error: error.value };
    } finally {
      formState.isSubmitting = false;
    }
  };

  // Update employee
  const updateEmployee = async (id: number, employeeData: UpdateEmployeeRequest) => {
    try {
      formState.isSubmitting = true;
      error.value = null;
      
      const updatedEmployee = await employeeService.updateEmployee(id, employeeData);
      const index = employees.value.findIndex(emp => emp.id === id);
      if (index !== -1) {
        employees.value[index] = updatedEmployee;
      }
      closeEditModal();
      showSuccess('Success!', 'Employee updated successfully');
      
      return { success: true, data: updatedEmployee };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update employee';
      showError('Error', error.value);
      console.error('Error updating employee:', err);
      return { success: false, error: error.value };
    } finally {
      formState.isSubmitting = false;
    }
  };

  // Delete employee
  const deleteEmployee = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;
      
      await employeeService.deleteEmployee(id);
      employees.value = employees.value.filter(emp => emp.id !== id);
      closeDeleteModal();
      showSuccess('Success!', 'Employee deleted successfully');
      
      return { success: true };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete employee';
      showError('Error', error.value);
      console.error('Error deleting employee:', err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Modal management functions
  const openCreateModal = () => {
    resetForm();
    modalState.isCreateModalOpen = true;
  };

  const closeCreateModal = () => {
    modalState.isCreateModalOpen = false;
    resetForm();
  };

  const openEditModal = (employee: Employee) => {
    modalState.selectedEmployee = employee;
    formState.name = employee.name;
    formState.imageBytes = employee.imageBytes || '';
    modalState.isEditModalOpen = true;
  };

  const closeEditModal = () => {
    modalState.isEditModalOpen = false;
    modalState.selectedEmployee = null;
    resetForm();
  };

  const openDeleteModal = (employee: Employee) => {
    modalState.selectedEmployee = employee;
    modalState.isDeleteModalOpen = true;
  };

  const closeDeleteModal = () => {
    modalState.isDeleteModalOpen = false;
    modalState.selectedEmployee = null;
  };

  // Form management
  const resetForm = () => {
    formState.name = '';
    formState.imageBytes = '';
    formState.imageFile = null;
    formState.isSubmitting = false;
  };

  const handleImageUpload = async (file: File) => {
    try {
      formState.imageFile = file;
      const imageBytes = await employeeService.convertImageToBase64(file);
      formState.imageBytes = imageBytes;
      return imageBytes;
    } catch (err) {
      error.value = 'Failed to process image';
      console.error('Error processing image:', err);
      return null;
    }
  };

  // Submit handlers
  const handleCreateSubmit = async () => {
    if (!formState.name.trim()) {
      error.value = 'Name is required';
      return;
    }

    const employeeData: CreateEmployeeRequest = {
      name: formState.name.trim(),
      imageBytes: formState.imageBytes || undefined,
    };

    return await createEmployee(employeeData);
  };

  const handleEditSubmit = async () => {
    if (!modalState.selectedEmployee || !formState.name.trim()) {
      error.value = 'Name is required';
      return;
    }

    const employeeData: UpdateEmployeeRequest = {
      name: formState.name.trim(),
      imageBytes: formState.imageBytes || undefined,
    };

    return await updateEmployee(modalState.selectedEmployee.id!, employeeData);
  };

  const handleDeleteSubmit = async () => {
    if (!modalState.selectedEmployee) {
      error.value = 'No employee selected';
      return;
    }

    return await deleteEmployee(modalState.selectedEmployee.id!);
  };

  return {
    // State
    employees: readonly(employees),
    loading: readonly(loading),
    error: readonly(error),
    modalState: readonly(modalState),
    formState: readonly(formState),
    
    // Actions
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    
    // Modal management
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    
    // Form management
    resetForm,
    handleImageUpload,
    
    // Submit handlers
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteSubmit,
  };
};
